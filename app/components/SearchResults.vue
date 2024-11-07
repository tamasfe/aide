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

const initialLoad = useState(() => true);

/**
 * Game search
 */
const gamesCurrentPage = useState(() => 0);
const gamesIds = useState<number[]>(() => []);
const gamesTotalItems = useState(() => 0);
const gamesLoading = useState(() => false);
const gamesOnLoadMore = async (actionOnItemsArray: "append" | "replace") => {
  gamesLoading.value = true;
  const result = await $dependencies.games.ui.searchGamesByQueryPaginatingOnSearchBar.handle(query, gamesCurrentPage.value);

  gamesTotalItems.value = result.totalGames;
  if (actionOnItemsArray === "append") {
    gamesIds.value.push(...result.games.map(game => game.id));
  }
  else if (actionOnItemsArray === "replace") {
    gamesIds.value = result.games.map(game => game.id);
  }

  gamesCurrentPage.value++;
  gamesLoading.value = false;
};

/**
 * Provider search
 */
const providersCurrentPage = useState(() => 0);
const providersIds = useState<number[]>(() => []);
const providersTotalItems = useState(() => 0);
const providersLoading = useState(() => false);
const providersOnLoadMore = async (actionOnItemsArray: "append" | "replace") => {
  providersLoading.value = true;
  const result = await $dependencies.providers.ui.searchProvidersOnGrid.handle(query, providersCurrentPage.value);

  providersTotalItems.value = result.totalProviders;
  if (actionOnItemsArray === "append") {
    providersIds.value.push(...result.providers.map(provider => provider.id));
  }
  else if (actionOnItemsArray === "replace") {
    providersIds.value = result.providers.map(provider => provider.id);
  }

  providersCurrentPage.value++;
  providersLoading.value = false;
};

const onQueryChange = async () => {
  if (!query) {
    initialLoad.value = true;

    gamesTotalItems.value = 0;
    gamesIds.value = [];

    providersTotalItems.value = 0;
    providersIds.value = [];
    return;
  }

  initialLoad.value = false;

  gamesCurrentPage.value = 0;
  providersCurrentPage.value = 0;

  await Promise.all([
    providersOnLoadMore("replace"),
    gamesOnLoadMore("replace"),
  ]);
};

const loading = computed(() => gamesLoading.value || providersLoading.value);
const noResults = computed(() => gamesIds.value.length === 0 && providersIds.value.length === 0);

// COMMENT OUT TO TRY THROTTLE WATCH
watch(() => query, useThrottleFn(onQueryChange, 100, true, true, true), { immediate: true });

// UNCOMMENT TO TRY DEBOUNCED WATCH
// debouncedWatch(() => query, onQueryChange, { debounce: 200, immediate: true });
</script>

<template>
  <div class="space-y-8">
    <GridVerticalSearch
      v-if="gamesIds.length > 0"
      item-type="game"
      :item-ids="gamesIds"
      :total-results="gamesTotalItems"
      :on-load-more="() => gamesOnLoadMore('append')"
      :loading="gamesLoading"
    >
      <template #default="{ itemId: itemId }">
        <NuxtLink
          :to="`/games/${itemId}`"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <GamesImageLoader :game-id="itemId" />
        </NuxtLink>
      </template>
    </GridVerticalSearch>

    <GridVerticalSearch
      v-if="providersIds.length > 0"
      item-type="provider"
      :item-ids="providersIds"
      :total-results="providersTotalItems"
      :on-load-more="() => providersOnLoadMore('append')"
      :loading="providersLoading"
    >
      <template #default="{ itemId: itemId }">
        <NuxtLink
          :to="`/providers/${itemId}`"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <ProviderImageLoader :provider-id="itemId" />
        </NuxtLink>
      </template>
    </GridVerticalSearch>
  </div>

  <BaseEmpty
    v-if="!loading && noResults"
    :title="$t('search.no_results')"
    icon="lucide:search-x"
  />

  <div v-if="loading && noResults" class="flex items-center justify-center py-10">
    <BaseSpinner />
  </div>
</template>
