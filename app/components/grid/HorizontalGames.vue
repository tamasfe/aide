<script setup lang="ts">
// STATUS:
// - Move loading into wrapper?

const props = defineProps<{
  categoryIdentifier: string;
}>();

const { $dependencies } = useNuxtApp();

const slidesToScroll = ref({
  sm: 3,
  md: 3,
  lg: 3,
  xl: 3,
});

const columns = ref({
  sm: 2.7,
  md: 3.7,
  lg: 6,
  xl: 8,
});

const query = $dependencies.games.ui.searchGamesByCategoryPaginatingOnHorizontalSlider;

const loading = ref(false);
const nextGamesPageToSearch = ref(0);
const gameIds = ref<number[]>([]);
const canLoadMore = ref(true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  if (loading.value) return;
  loading.value = true;

  const { games: foundGames, canLoadMore: updatedCanLoadMore } = await query.handle(props.categoryIdentifier, nextGamesPageToSearch.value);
  gameIds.value.push(...foundGames.map(game => game.id));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;

  loading.value = false;
};

await onLoadData();
</script>

<template>
  <GridHeaderHorizontal
    :data="gameIds"
    :loading="loading"
    :can-load-more="canLoadMore"
    :slides-to-scroll="slidesToScroll"
    :columns="columns"
    :slides-before-load="10"
    aspect-ratio="3/4"
    @trigger:load="onLoadData"
  >
    <template #title>
      <GridHeaderTitle title="🔥 Top Trending" />
    </template>

    <template #options>
      <NuxtLink
        :to="{ name: 'categories-id', params: { id: props.categoryIdentifier } }"
      >
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ $t("button.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template>

    <template #default="{ item: gameId }">
      <NuxtLink
        :to="{ name: 'games-id', params: { id: gameId } }"
        class="block bg-subtle rounded-default w-full h-full overflow-hidden"
      >
        <GamesImageLoader :game-id="gameId" />
      </NuxtLink>
    </template>

    <template
      v-if="canLoadMore"
      #loading
    >
      <div class="flex items-center justify-center w-full h-full bg-subtle rounded-default">
        <BaseSpinner
          class="text-subtle"
          :size="34"
        />
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
