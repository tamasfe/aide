<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * use skeleton loaders and loading spinner inside search bar IF it looks good. loading spinner in search input might give impression that its "slow" (bitstarz doesnt do this and it feels faster psychologically.... will just have to see it and decide)

const { $dependencies } = useNuxtApp();

const { query } = defineProps({
  query: {
    type: String,
    required: true,
    default: "",
  },
});

const loading = ref(false);
const currentPage = ref(0);
const gamesIds = ref<number[]>([]);
const totalGames = ref(0);

const onLoadMore = async () => {
  if (!query || loading.value) {
    return;
  }

  loading.value = true;
  const result = await $dependencies.games.ui.searchGamesByQueryPaginatingOnSearchBar.handle(query, currentPage.value);

  totalGames.value = result.totalGames;
  gamesIds.value.push(...result.games.map(game => game.id));

  currentPage.value++;
  loading.value = false;
};

const onQueryChange = async () => {
  if (loading.value) {
    return;
  }

  if (!query) {
    totalGames.value = 0;
    gamesIds.value = [];
    return;
  }

  loading.value = true;
  currentPage.value = 0;
  const result = await $dependencies.games.ui.searchGamesByQueryPaginatingOnSearchBar.handle(query, currentPage.value);

  totalGames.value = result.totalGames;
  gamesIds.value = result.games.map(game => game.id);

  currentPage.value++;
  loading.value = false;
};

watch(() => query, onQueryChange, { immediate: true });
</script>

<template>
  <GridVerticalSearch
    v-show="gamesIds.length > 0"
    :game-ids="gamesIds"
    :total-results="totalGames"
    :on-load-more="onLoadMore"
  />
</template>
