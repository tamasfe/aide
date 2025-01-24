<script setup lang="ts">
const props = defineProps<{
  title: string;
  categoryIdentifier: string | null;
  providerId: number | null;
}>();

const { $dependencies } = useNuxtApp();
const { navigateBackOrHome } = useNavigateBackOrHome();

const loading = useState(`grid-vertical-games-loading-for-${props.categoryIdentifier}-${props.providerId}`, () => true);
const totalGamesOfCategory = useState(`grid-vertical-games-total-for-${props.categoryIdentifier}-${props.providerId}`, () => 0);
const nextGamesPageToSearch = useState(`grid-vertical-games-next-page-for-${props.categoryIdentifier}-${props.providerId}`, () => 0);
const gameIds = useState<{ id: number; imageUrl: string }[]>(`grid-vertical-games-ids-for-${props.categoryIdentifier}-${props.providerId}`, () => []);
const canLoadMore = useState(`grid-vertical-games-can-load-more-for-${props.categoryIdentifier}-${props.providerId}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { games: foundGames, canLoadMore: updatedCanLoadMore, totalGames } = await $dependencies.games.ui.searchGamesPaginatingOnGrid.handle(props.categoryIdentifier, props.providerId, nextGamesPageToSearch.value);
  gameIds.value.push(...foundGames);
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;
  totalGamesOfCategory.value = totalGames;

  loading.value = false;
};

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData(`load-games-for-${props.categoryIdentifier}`, () => onLoadData().then(() => true),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <BaseButton
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

    <!--
    (Extract from from Slack 16/10/2024) TODO in the future:
    The base select here will allow, eventually, people to be able to sort games by:
    - most popular
    - name
    - if they click a category like "blackjack" which includes multiple providers: it will also allow filtering by provider name

    <template #options>
      <div class="w-full max-w-[12rem]">
        <BaseSelect size="sm" />
      </div>
    </template>
    -->

    <GridVertical
      aspect-ratio="3/4"
      :columns="{ sm: 3, md: 4, lg: 6, xl: 8 }"
      :data="gameIds"
      :loading="loading"
      :total-count="totalGamesOfCategory"
      pagination
      @trigger:load="onLoadData"
    >
      <template #default="{ data: game }">
        <GameImageLink
          :id="game.id"
          :src="game.imageUrl"
          animation-on-hover="zoom-in"
        />
      </template>
    </GridVertical>
  </GridHeader>
</template>
