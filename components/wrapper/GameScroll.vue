<script setup lang="ts">
import { getGameCategoryTranslationKey } from "~/utils";
import { useGames } from "~/composables/useGames";

// TODO: seo
// TODO: use slug for game url
// ( need to fetch game by slug or use both id and slug )
const { isMobile } = useDevice();
const { t } = useI18n();

// temp
const size = 20;

// TODO: use translation key
const props = defineProps<{
  identifier: string;
  categories: number[];
}>();

const categories = ref(props.categories);

// because useFetch is fetching twice
// ( client and server it results in flickering )
const { data: games, status } = await useGames(categories.value);

const loading = computed(() => status.value === "pending");
const data = computed(() => {
  if (!games.value) {
    const placeholder = generateSkeletonPlaceholderData(size);
    return placeholder;
  }
  return games.value.data;
});
</script>

<template>
  <GridScroll
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :slides-to-scroll="3"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">
        {{ t(getGameCategoryTranslationKey(identifier)) }}
      </h2>
    </template>
    <template #options>
      <BaseButton class="bg-subtle text-subtle hover:bg-emphasis">
        {{ t("misc.see_all") }}
      </BaseButton>
    </template>
    <template #default="{ data: game }">
      <div
        class="basis-[calc((100%-2rem)/2.5)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <BaseSkeleton
            :loading="loading"
            class="absolute left-0 top-0 w-full h-full"
          >
            <NuxtLink
              v-if="game"
              :to="`/games/${game.id}`"
            >
              <span class="block">
                <NuxtImg
                  :src="getGameImageUrl(game.id, 'large')"
                  alt=""
                  class="absolute top-0 left-0 w-full object-cover rounded-default transition-transform transform hover:scale-105 cursor-pointer"
                />
              </span>
            </NuxtLink>
          </BaseSkeleton>
        </div>
      </div>
    </template>
  </GridScroll>
</template>
