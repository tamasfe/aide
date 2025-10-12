<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const { t } = useI18n();

useHead({
  title: t("page.dashboard_history"),
});

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
const loading = useState(`history-page-casino-loading`, () => true);
const pageIndex = useState(`history-page-casino-page-index`, () => 0);
const totalItems = useState(`history-page-casino-total-items`, () => $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.PAGINATION_SIZE);
const pageSize = ref($dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.PAGINATION_SIZE);

const { data } = useAsyncData(`dashboard-history-casino-table`, async () => {
  if (!walletStore.wallet) {
    return;
  }

  loading.value = true;
  const result = await $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.handle(pageIndex.value);

  pageSize.value = result.pageSize;
  totalItems.value = result.totalItems;
  loading.value = false;

  return result;
},
{ watch: [pageIndex], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const pagination = computed(() => {
  if (data === undefined) return undefined;
  return {
    pageIndex: pageIndex,
    pageSize: pageSize,
    rowCount: totalItems,
    updatePageIndex: (index: number) => { pageIndex.value = index; },
  };
});
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="history"
  >
    <DataTableGameActionsCasino
      :data="data?.gameActions ?? []"
      :loading="loading"
      :pagination="pagination"
    />
  </NuxtLayout>
</template>
