<script setup lang="ts">
const props = defineProps<{
  categoryIdentifier: string;
  initialGames?: { id: number; imageUrl: string }[];
}>();

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

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

const paginationSize = computed(() => props.initialGames ? props.initialGames.length : 25);
const slidesBeforeLoad = 4; // We aribitrarely set it to +1 the slides to scroll to give time for the loading one scroll ahead
const games = useState<{ id: number; imageUrl: string; key: string }[]>(`grid-horizontal-games-ids-for-${props.categoryIdentifier}`, () => props.initialGames ? props.initialGames.map(game => useAddKeyFromId(game)) : []);
const loading = useState(`grid-horizontal-games-loading-for-${props.categoryIdentifier}`, () => false);
const nextGamesPageToSearch = useState(`grid-horizontal-games-next-page-for-${props.categoryIdentifier}`, () => props.initialGames ? 1 : 0);
const canLoadMore = useState(`grid-horizontal-games-can-load-more-for-${props.categoryIdentifier}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { games: foundGames, canLoadMore: updatedCanLoadMore } = await $dependencies.games.ui.searchGamesPaginatingOnGrid.handle(props.categoryIdentifier, null, nextGamesPageToSearch.value, paginationSize.value);
  games.value.push(...foundGames.map(game => useAddKeyFromId(game)));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;

  loading.value = false;
};

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
if (!props.initialGames) {
  await useAsyncData(`load-games-for-${props.categoryIdentifier}`,
    () => onLoadData().then(() => true),
    { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
  );
}
</script>

<template>
  <GridHeaderHorizontal
    v-if="loading || games.length > 0"
    class="gap-2"
    :data="games"
    :loading="loading"
    :can-load-more="canLoadMore"
    :slides-to-scroll="slidesToScroll"
    :columns="columns"
    :slides-before-load="slidesBeforeLoad"
    :manual-scroll="true"
    aspect-ratio="3/4"
    @trigger:load="onLoadData"
  >
    <template #title>
      <GridHeaderTitle :title="t(`category.${categoryIdentifier}`)" />
    </template>

    <template #options>
      <BaseLink
        :to="{ name: 'categories-id', params: { id: props.categoryIdentifier } }"
      >
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ $t("button.see_all") }}
        </BaseButton>
      </BaseLink>
    </template>

    <template #default="{ item: game }">
      <GameImageLink
        :id="game.id"
        :src="game.imageUrl"
        :animation-on-hover="'vertical-translate'"
      />
    </template>

    <template
      v-if="loading"
      #loading
    >
      <div class="flex items-center justify-center w-full h-full bg-subtle rounded">
        <BaseSpinner
          class="text-subtle"
          :size="32"
        />
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
