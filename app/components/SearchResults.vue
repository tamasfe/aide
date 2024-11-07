<script setup lang="ts">
// UNCOMMENT TO TRY DEBOUNCED WATCH
// import { debouncedWatch } from "@vueuse/core";

// COMMENT OUT TO TRY DEBOUNCED WATCH
import { useThrottleFn } from "@vueuse/core";

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
const initialLoad = ref(true);

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
  if (!query) {
    initialLoad.value = true;
    totalGames.value = 0;
    gamesIds.value = [];
    return;
  }

  initialLoad.value = false;
  loading.value = true;
  currentPage.value = 0;
  const result = await $dependencies.games.ui.searchGamesByQueryPaginatingOnSearchBar.handle(query, currentPage.value);

  totalGames.value = result.totalGames;
  gamesIds.value = result.games.map(game => game.id);

  currentPage.value++;
  loading.value = false;
};

// COMMENT OUT TO TRY THROTTLE WATCH
watch(() => query, useThrottleFn(onQueryChange, 100, true, true), { immediate: true });

// UNCOMMENT TO TRY DEBOUNCED WATCH
// debouncedWatch(() => query, onQueryChange, { debounce: 200, immediate: true });
</script>

<template>
  <div>
    <GridVerticalSearch
      v-if="gamesIds.length > 0"
      :game-ids="gamesIds"
      :total-results="totalGames"
      :on-load-more="onLoadMore"
    />
    <div v-else-if="initialLoad && loading" class="flex items-center justify-center py-10">
      <BaseSpinner />
    </div>
    <BaseEmpty
      v-else-if="!loading"
      :title="$t('search.no_results')"
      icon="lucide:search-x"
    />
  </div>
</template>
