<script setup lang="ts">
// 2 alternates if ever needed...
import { debouncedWatch } from "@vueuse/core";
import type { GameSearchResponse } from "~/modules/games/domain/Game";
import type { Provider } from "~/modules/providers/domain/Provider";
import type { Keyified } from "~/types/utils";

// import { debouncedWatch } from "@vueuse/core";

const { $dependencies } = useNuxtApp();

const { query } = defineProps({
  query: {
    type: String,
    required: true,
    default: "",
  },
});

/**
 * Game search
 */
const gamesCurrentPage = useState(() => 0);
const games = useState<Keyified<GameSearchResponse>[]>(() => []);
const gamesTotalItems = useState(() => 0);
const gamesLoading = useState(() => false);
const gamesOnLoadMore = async (actionOnItemsArray: "append" | "replace") => {
  gamesLoading.value = true;
  const result = await $dependencies.games.ui.searchGamesByQueryPaginatingOnSearchBar.handle(query, gamesCurrentPage.value);

  gamesTotalItems.value = result.totalGames;
  if (actionOnItemsArray === "append") {
    games.value.push(...result.games.map(game => useAddKeyFromIdentifier(game)));
  }
  else if (actionOnItemsArray === "replace") {
    games.value = result.games.map(game => useAddKeyFromIdentifier(game));
  }

  gamesCurrentPage.value++;
  gamesLoading.value = false;
};

/**
 * Provider search
 */
const providersCurrentPage = useState(() => 0);
const providers = useState<Keyified<Provider>[]>(() => []);
const providersTotalItems = useState(() => 0);
const providersLoading = useState(() => false);
const providersOnLoadMore = async (actionOnItemsArray: "append" | "replace") => {
  providersLoading.value = true;
  const result = await $dependencies.providers.ui.searchProvidersOnGrid.handle(query, providersCurrentPage.value);

  providersTotalItems.value = result.totalProviders;
  if (actionOnItemsArray === "append") {
    providers.value.push(...result.providers.map(provider => useAddKeyFromIdentifier(provider)));
  }
  else if (actionOnItemsArray === "replace") {
    providers.value = result.providers.map(provider => useAddKeyFromIdentifier(provider));
  }

  providersCurrentPage.value++;
  providersLoading.value = false;
};

const onQueryChange = async () => {
  games.value = [];
  providers.value = [];
  gamesCurrentPage.value = 0;
  providersCurrentPage.value = 0;

  await Promise.all([
    providersOnLoadMore("replace"),
    gamesOnLoadMore("replace"),
  ]);
};

const loading = computed(() => gamesLoading.value || providersLoading.value);
const noResults = computed(() => games.value.length === 0 && providers.value.length === 0);

// 2 alternate methods if ever needed
// watch(() => query, useThrottleFn(onQueryChange, 150, true, true, true), { immediate: true });
debouncedWatch(() => query, onQueryChange, { debounce: 150, immediate: true });

const onClickLink = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <div class="space-y-8">
    <GridVerticalSearch
      v-if="games.length > 0"
      item-type="game"
      :items="games"
      :total-results="gamesTotalItems"
      :on-load-more="() => gamesOnLoadMore('append')"
      :loading="gamesLoading"
    >
      <template #default="{ item: game }">
        <GameImageLink
          :identifier="game.identifier"
          class="border-none"
          animation-on-hover="vertical-translate"
          fallback-image-class="px-8"
          @click="onClickLink"
        />
      </template>
    </GridVerticalSearch>

    <GridVerticalSearch
      v-if="providers.length > 0"
      item-type="provider"
      :items="providers"
      :total-results="providersTotalItems"
      :on-load-more="() => providersOnLoadMore('append')"
      :loading="providersLoading"
    >
      <template #default="{ item: item }">
        <GamePageLink
          :identifier="item.identifier"
          class="block bg-subtle rounded w-full h-full overflow-hidden"
          @click="onClickLink"
        >
          <ProviderImageLoader :provider-identifier="item.identifier" />
        </GamePageLink>
      </template>
    </GridVerticalSearch>
  </div>

  <BaseEmpty
    v-if="!loading && noResults"
    :title="$t('search.no_results')"
    icon="lucide:search-x"
    :size="32"
    text-class="text-xl"
  />

  <div v-if="loading && noResults" class="flex items-center justify-center py-10">
    <BaseSpinner class="text-subtle" :size="32" />
  </div>
</template>
