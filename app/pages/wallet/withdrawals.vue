<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();
const wallet = useWalletModule();

definePageMeta({
  middleware: ["authenticated", "active-wallet"],
});

useHead({
  title: t("page.account_history"),
});

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`history-page-withdrawals-loading`, () => true);
const pageIndex = useState(`history-page-withdrawals-page-index`, () => 0);
const totalItems = useState(`history-page-withdrawals-total-items`, () => wallet.ui.searchPaymentsOnTable.PAGE_SIZE);
const pageSize = ref(wallet.ui.searchPaymentsOnTable.PAGE_SIZE);

const { data } = useAsyncData("history-page-withdrawals-data", async () => {
  if (!walletStore.wallet) return;

  loading.value = true;
  const data = await wallet.ui.searchPaymentsOnTable.handle(walletStore.wallet.wallet_id, "withdrawal", pageIndex.value);

  pageSize.value = data.pageSize;
  totalItems.value = data.totalItems;
  loading.value = false;

  return data.payments;
}, {
  watch: [() => walletStore.wallet?.wallet_id, () => walletStore.balance, pageIndex],
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
  <DataTableWalletPayments
    class="bg-subtle rounded border border-muted/5 p-4"
    :payments="data || []"
    :loading="loading"
    :pagination="pagination"
  >
    <template #empty>
      <BaseEmpty
        :title="$t('account.history.withdrawals.table_empty')"
        icon="lucide:circle-arrow-up"
      />
    </template>
  </DataTableWalletPayments>
</template>
