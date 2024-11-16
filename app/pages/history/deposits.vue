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

const { data } = await useAsyncData("history-page-deposits-data", async () => {
  if (!walletStore.isInit) return;

  loading.value = true;
  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.id, "deposit", 0);

  loading.value = false;
  return data.payments;
}, {
  watch: [() => walletStore.wallet?.id],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
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
