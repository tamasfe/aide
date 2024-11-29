<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();

// TODO: do we want this behaviour? Or should we (for example) keep the user in the page and show them a "log in to see your balance & transactions" message?
if (!walletStore.isInit) {
  await navigateTo("/");
}

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const NUMBER_OF_PAYMENTS_TO_SHOW = 10;

const loading = useState(`wallet-page-payments-loading`, () => true);

const { data } = await useAsyncData("wallet-page-payments-data", async () => {
  if (!walletStore.isInit) return;

  loading.value = true;
  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.id, null, 0, NUMBER_OF_PAYMENTS_TO_SHOW);

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
    section="settings"
  >
    <div>
      <DashboardSettingsWalletBalance
        v-if="walletStore.isInit"
        :balance="walletStore.wallet.balance"
        :currency="walletStore.wallet.currency"
        :wallet-id="walletStore.wallet.id"
        :on-click-deposit="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit').then(() => {})"
        :on-click-withdraw="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('withdrawal').then(() => {})"
      />

      <div class="mt-8">
        <h2 class="mb-8 text-center text-lg font-medium">{{ $t('dashboard.settings.wallet.transactions_title') }}</h2>
        <DataTableWalletPayments
          :title-empty="$t('dashboard.settings.wallet.transactions_empty')"
          :payments="data || []"
          :loading="loading"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
