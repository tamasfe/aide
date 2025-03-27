<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const { t } = useI18n();

useHead({
  title: t("page.dashboard_history"),
});

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`history-page-withdrawals-loading`, () => true);
const pageIndex = useState(`history-page-withdrawals-page-index`, () => 0);
const totalItems = useState(`history-page-withdrawals-total-items`, () => $dependencies.wallets.ui.searchPaymentsOnTable.PAGE_SIZE);
const pageSize = ref($dependencies.wallets.ui.searchPaymentsOnTable.PAGE_SIZE);

const { data } = await useAsyncData("history-page-withdrawals-data", async () => {
  if (!walletStore.isInit) return;

  loading.value = true;
  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.walletId, "withdrawal", pageIndex.value);

  pageSize.value = data.pageSize;
  totalItems.value = data.totalItems;
  loading.value = false;

  return data.payments;
}, {
  watch: [() => walletStore.wallet?.walletId, () => walletStore.balance, pageIndex],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});

const pagination = computed(() => {
  if (data === undefined) return undefined;
  return {
    pageIndex,
    pageSize,
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
    <DataTableWalletPayments
      :payments="data || []"
      :loading="loading"
      :pagination="pagination"
    >
      <template #empty>
        <BaseEmpty
          :title="$t('dashboard.history.withdrawals.table_empty')"
          icon="lucide:circle-arrow-up"
        />
      </template>
    </DataTableWalletPayments>
  </NuxtLayout>
</template>
