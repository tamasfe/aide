<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();

// TODO: do we want this behaviour? Or should we (for example) keep the user in the page and show them a "log in to see your balance & transactions" message?
if (!walletStore.isInit) {
  await navigateTo("/");
}

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`history-page-deposits-loading`, () => true);
const pageIndex = useState(`history-page-deposits-page-index`, () => 0);
const totalItems = useState(`history-page-deposits-total-items`, () => $dependencies.wallets.ui.searchPaymentsOnTable.PAGE_SIZE);
const pageSize = ref($dependencies.wallets.ui.searchPaymentsOnTable.PAGE_SIZE);

const { data } = await useAsyncData("history-page-deposits-data", async () => {
  if (!walletStore.isInit) return;

  loading.value = true;
  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.id, "deposit", pageIndex.value);

  pageSize.value = data.pageSize;
  totalItems.value = data.totalItems;
  loading.value = false;
  return data.payments;
}, {
  watch: [() => walletStore.wallet?.id, () => walletStore.wallet?.balance, pageIndex],
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
          :title="$t('dashboard.history.deposits.table_empty')"
          icon="lucide:circle-arrow-down"
        />
      </template>
    </DataTableWalletPayments>
  </NuxtLayout>
</template>
