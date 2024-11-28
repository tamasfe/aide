<script setup lang="ts">
const props = defineProps<{
  categoryIdentifier: string;
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

const query = $dependencies.games.ui.searchGamesPaginatingOnGrid;

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`grid-horizontal-games-loading-for-${props.categoryIdentifier}`, () => true);
const nextGamesPageToSearch = useState(`grid-horizontal-games-next-page-for-${props.categoryIdentifier}`, () => 0);
const games = useState<{ id: number; imageUrl: string }[]>(`grid-horizontal-games-ids-for-${props.categoryIdentifier}`, () => []);
const canLoadMore = useState(`grid-horizontal-games-can-load-more-for-${props.categoryIdentifier}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { games: foundGames, canLoadMore: updatedCanLoadMore } = await query.handle(props.categoryIdentifier, null, nextGamesPageToSearch.value);
  games.value.push(...foundGames.map(game => ({ id: game.id, imageUrl: game.imageUrl })));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;

  loading.value = false;
};

await useAsyncData(`load-games-for-${props.categoryIdentifier}`, () => onLoadData().then(() => true), { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });
</script>

<template>
  <div>
    <GridHeaderHorizontal
      v-if="loading || games.length > 0"
      :data="games"
      :loading="loading"
      :can-load-more="canLoadMore"
      :slides-to-scroll="slidesToScroll"
      :columns="columns"
      :slides-before-load="10"
      aspect-ratio="3/4"
      @trigger:load="onLoadData"
    >
      <template #title>
        <GridHeaderTitle :title="t(`category.${categoryIdentifier}`)" />
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

      <template #default="{ item: game }">
        <NuxtLink
          :to="{ name: 'games-id', params: { id: game.id } }"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <GamesImageLoader :src="game.imageUrl" />
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
  </div>
</template>
