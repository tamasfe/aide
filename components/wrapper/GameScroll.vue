<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import { getGameCategoryTranslationKey, getGameImageUrl } from "~/utils";
import { useGames } from "~/composables/useGames";
import type { Game } from "~/types/game";

const INITIAL_GAMES_PER_CATEGORY = 100;
const LAZY_LOAD_GAMES_PER_CATEGORY = 40;

type GridScrollEvent = {
  scrollLeft: number;
  scrollWidth: number;
  boundingClientRect: DOMRect;
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

const options = ref({
  offset: 0,
  limit: INITIAL_GAMES_PER_CATEGORY,
  categories: [props.identifier],
});

const { data: games, status, refresh } = await useGames(options);
const data = ref<(Game | null)[]>([]);

const isLastPage = () => {
  if (!games.value) return false;
  // TODO: this should come from API
  return games.value.data.length < options.value.limit;
};

const onScroll = (event: GridScrollEvent) => {
  if (status.value === "pending" || isLastPage()) return;
  // we check if we are close to the end of the scroll
  const pxToEnd
    = event.scrollWidth - event.scrollLeft - event.boundingClientRect.width;
  if (pxToEnd < 1200) {
    // we check if we have already fetched this offset and limit
    // if not, we fetch more data by increasing the offset
    const newOffset = options.value.offset + options.value.limit;
    if (
      !loadedOffsetLimitCombinations.has(`${newOffset}-${options.value.limit}`)
    ) {
      // triggers refetch becuase useGames
      // composable is watching for options change
      options.value.offset = newOffset;
      refresh();
    }
  }
};

// Every time games change, we append data because
// we guarantee that only unique games are fetched
watch(
  games,
  () => {
    if (games.value && games.value.data.length) {
      loadedOffsetLimitCombinations.add(
        `${options.value.offset}-${options.value.limit}`,
      );
      data.value = data.value.concat(games.value.data);
    }
  },
  {
    immediate: true,
  },
);

// once hydrated we set the limit and offset
onMounted(() => {
  options.value.limit = LAZY_LOAD_GAMES_PER_CATEGORY;
  options.value.offset = INITIAL_GAMES_PER_CATEGORY;
});
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
          class="bg-subtle text-sm text-subtle hover:bg-emphasis"
          type="button"
        >
          {{ t("button.see_all") }}
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
              class="block"
            >
              <span class="block">
                <NuxtImg
                  :src="getGameImageUrl(game.id, 'large')"
                  alt=""
                  class="block absolute top-0 left-0 w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
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
