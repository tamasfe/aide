<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import { getGameCategoryTranslationKey, getGameImageUrl } from "~/utils";
import { useGames } from "~/composables/useGames";
import type { Game } from "~/types/game";

type GridScrollEvent = {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
};

// TODO: seo
// TODO: use slug for game url
// ( need to fetch game by slug or use both id and slug )
const { isMobile } = useDevice();
const { t } = useI18n();

const loadedOffsetLimitCombinations = new Set<string>();

// TODO: use translation key
const props = defineProps<{
  identifier: string;
}>();

const options = reactive({
  offset: 0,
  limit: 100,
  categories: [props.identifier],
});

const { data: games, status } = await useGames(options);
const data = ref<(Game | null)[]>([]);

const isLastPage = () => {
  if (!games.value) return false;
  // TODO: this should come from API
  return games.value.data.length < options.limit;
};

const onScroll = (event: GridScrollEvent) => {
  if (status.value === "pending" || isLastPage()) return;
  // we check if we are close to the end of the scroll
  const pxToEnd = event.scrollWidth - event.scrollLeft - event.clientWidth;
  if (pxToEnd < 1200) {
    // we check if we have already fetched this offset and limit
    // if not, we fetch more data by increasing the offset
    const newOffset = options.offset + options.limit;
    if (!loadedOffsetLimitCombinations.has(`${newOffset}-${options.limit}`)) {
      // triggers refetch becuase useGames
      // composable is watching for options change
      options.offset = newOffset;
    }
  }
};

// Every time games change, we append data because
// we guarantee that only unique games are fetched
watch(
  games,
  () => {
    if (games.value && games.value.data.length) {
      loadedOffsetLimitCombinations.add(`${options.offset}-${options.limit}`);
      data.value = data.value.concat(games.value.data);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <GridScroll
    :data="data"
    :show-controls="!isMobile"
    :loading="!data.length"
    :slides-to-scroll="3"
    @scrolled="onScroll"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">
        {{ t(getGameCategoryTranslationKey(identifier)) }}
      </h2>
    </template>
    <template #options>
      <NuxtLink :to="`/categories/${identifier}`">
        <BaseButton
          class="bg-subtle text-subtle hover:bg-emphasis"
          type="button"
        >
          {{ t("misc.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template>
    <template #default="{ data: game }">
      <div
        class="basis-[calc((100%-2rem)/2)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <div class="absolute left-0 top-0 w-full h-full">
            <NuxtLink
              v-if="game"
              :to="`/games/${game.id}`"
            >
              <span class="block">
                <NuxtImg
                  :src="getGameImageUrl(game.id, 'large')"
                  alt=""
                  class="absolute top-0 left-0 w-full h-full object-cover rounded-default transition-transform transform hover:scale-105 cursor-pointer"
                />
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
    <template
      v-if="status === 'pending'"
      #loading
    >
      <div
        class="basis-[calc((100%-2rem)/2)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <div
            class="absolute left-0 top-0 w-full h-full grid place-items-center"
          >
            <PhCircleNotch
              class="animate-spin text-subtle"
              :size="32"
            />
          </div>
        </div>
      </div>
    </template>
  </GridScroll>
</template>
