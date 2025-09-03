<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";
import type { Keyified } from "~/types/utils";

const props = defineProps<{
  title: string;
  categoryIdentifier: string | null;
  providerIdentifier: string | null;
  showBackButton?: boolean;
}>();

const { $dependencies } = useNuxtApp();
const { navigateBackOrHome } = useNavigateBackOrHome();

const loading = useState(`grid-vertical-games-loading-for-${props.categoryIdentifier}-${props.providerIdentifier}`, () => false);
const totalGamesOfCategory = useState(`grid-vertical-games-total-for-${props.categoryIdentifier}-${props.providerIdentifier}`, () => 0);
const nextGamesPageToSearch = useState(`grid-vertical-games-next-page-for-${props.categoryIdentifier}-${props.providerIdentifier}`, () => 0);
const games = useState<Keyified<Game>[]>(`grid-vertical-games-ids-for-${props.categoryIdentifier}-${props.providerIdentifier}`, () => []);
const canLoadMore = useState(`grid-vertical-games-can-load-more-for-${props.categoryIdentifier}-${props.providerIdentifier}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { games: gamesFound, canLoadMore: updatedCanLoadMore, totalGames } = await $dependencies.games.ui.listGamesPaginatingOnGrid.handle(props.categoryIdentifier, props.providerIdentifier, nextGamesPageToSearch.value);
  games.value.push(...gamesFound.map(game => useAddKeyFromIdentifier(game)));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;
  totalGamesOfCategory.value = totalGames;

  loading.value = false;
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData(`load-games-for-vertical-${props.categoryIdentifier}`,
  () => onLoadData().then(() => true),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <BaseButton
          v-if="props.showBackButton === true"
          variant="subtle"
          size="sm"
          class="p-1.5"
          @click="navigateBackOrHome"
        >
          <BaseIcon
            name="lucide:arrow-left"
            :size="24"
          />
        </BaseButton>

        <GridHeaderTitle :title="title" />
      </div>
    </template>

    <GridVertical
      aspect-ratio="3/4"
      :columns="{ sm: 3, md: 4, lg: 6, xl: 8 }"
      :data="games"
      :loading="loading"
      :total-count="totalGamesOfCategory"
      pagination
      @trigger:load="onLoadData"
    >
      <template #default="{ data: game }">
        <GameImageLink
          :identifier="game.identifier"
          animation-on-hover="vertical-translate"
        />
      </template>
    </GridVertical>

    <BaseEmpty
      v-if="!loading && games && games.length === 0"
      :title="$t('search.no_games')"
      icon="lucide:search-x"
      :size="32"
      text-class="text-lg"
    />
  </GridHeader>
</template>
