<script setup lang="ts">
const props = defineProps<{
  categoryIdentifier: string;
}>();

const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const { navigateBackOrHome } = useNavigateBackOrHome();

const query = $dependencies.games.ui.searchGamesByCategoryPaginatingOnSlider;

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = ref(true);
const totalGamesOfCategory = useState(`grid-vertical-games-total-for-${props.categoryIdentifier}`, () => 0);
const nextGamesPageToSearch = useState(`grid-vertical-games-next-page-for-${props.categoryIdentifier}`, () => 0);
const gameIds = useState<number[]>(`grid-vertical-games-ids-for-${props.categoryIdentifier}`, () => []);
const canLoadMore = useState(`grid-vertical-games-can-load-more-for-${props.categoryIdentifier}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { games: foundGames, canLoadMore: updatedCanLoadMore, totalGames } = await query.handle(props.categoryIdentifier, nextGamesPageToSearch.value);
  gameIds.value.push(...foundGames.map(game => game.id));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;
  totalGamesOfCategory.value = totalGames;

  loading.value = false;
};

await useAsyncData(`load-games-for-${props.categoryIdentifier}`, () => onLoadData().then(() => true), { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });
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
          <Icon
            name="lucide:arrow-left"
            size="24"
          />
        </BaseButton>

        <GridHeaderTitle :title="t(`category.${categoryIdentifier}`)" />
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
      :data="gameIds"
      :total-count="totalGamesOfCategory"
      :loading="loading"
      :columns="{ sm: 3, md: 4, lg: 6, xl: 8 }"
      aspect-ratio="3/4"
      pagination
      @trigger:load="onLoadData"
    >
      <template #default="{ data: gameId }">
        <NuxtLink
          :to="{
            name: 'games-id',
            params: {
              id: gameId,
            },
          }"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <GamesImageLoader :game-id="gameId" />
        </NuxtLink>
      </template>
    </GridVertical>
  </GridHeader>
</template>
