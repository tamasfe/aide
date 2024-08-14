<script setup lang="ts">
const { isMobile } = useDevice();
const { t } = useI18n();

const size = 20;

defineProps<{
  title: string;
}>();

const offset = Math.round(Math.random() * 1000);

const { data: games, status } = useFetch<Record<string, unknown>>(
  "http://localhost:3050/game/list",
  {
    query: {
      offset: offset,
      limit: 20,
    },
  },
);

const loading = computed(() => status.value === "pending");
const data = computed(() => {
  if (!games.value) {
    const empty = Array.from({ length: size }, _ => null);
    return empty;
  }
  return games.value.data as Record<string, unknown>[];
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
        {{ t("see_all") }}
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
                  :src="`http://localhost:3050/game/${game.id}/image?variant=large`"
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
