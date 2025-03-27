<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const { t } = useI18n();

useHead({
  title: t("page.dashboard_settings"),
});

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const NUMBER_OF_PAYMENTS_TO_SHOW = 10;

const loading = useState(`wallet-page-payments-loading`, () => true);

const { data: paymentsData } = await useAsyncData("wallet-page-payments-data", async () => {
  if (!walletStore.isInit) return;

  loading.value = true;
  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.walletId, null, 0, NUMBER_OF_PAYMENTS_TO_SHOW);

  loading.value = false;
  return data.payments;
}, {
  watch: [() => walletStore.wallet?.walletId, () => walletStore.balance],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
  default: () => [],
});
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <div>
      <ClientOnly>
        <DashboardSettingsWalletBalance
          v-if="walletStore.wallet"
          :balance="walletStore.balance"
          :payment-method="walletStore.wallet.paymentMethod ?? undefined"
          :currency="walletStore.wallet.currency"
          :wallet-id="walletStore.wallet.walletId"
          :on-click-deposit="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit').then(() => {})"
          :on-click-withdraw="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('withdrawal').then(() => {})"
        />
      </ClientOnly>

      <div class="mt-8">
        <h2 class="mb-8 text-center text-lg font-medium">{{ $t('dashboard.settings.wallet.transactions_title') }}</h2>
        <DataTableWalletPayments
          :title-empty="$t('dashboard.settings.wallet.transactions_empty')"
          :payments="paymentsData ?? []"
          :loading="loading"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
