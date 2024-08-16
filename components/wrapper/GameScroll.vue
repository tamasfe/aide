<script setup lang="ts">
import type { Game, ApiData } from "~/types/api";

// TODO: utils for img src
// TODO: seo
// TODO: translations
// TODO: utils for skeleton
const config = useRuntimeConfig();
const { isMobile } = useDevice();
const { t } = useI18n();

// temp
const size = 20;

// TODO: use translation key
defineProps<{
  title: string;
}>();

// temp
const offset = Math.round(Math.random() * 1000);

const { data: games, status } = useFetch<ApiData<Game[]>>("/game/list", {
  query: {
    offset: offset,
    limit: 20,
  },
  server: true,
  baseURL: config.public.apiBaseUrl,
});

const loading = computed(() => status.value !== "success");
const data = computed(() => {
  if (!games.value) {
    const empty = Array.from({ length: size }, (_) => null);
    return empty;
  }
  return games.value.data;
});

watch(loading, (value) => {
  console.log("[GameScroll] new loading value", value);
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
      <h2 class="text-xl sm:text-2xl">{{ title }}</h2>
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
            <NuxtLink v-if="game" :to="`/games/${game.id}`">
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
