<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const { t } = useI18n();

useHead({
  title: t("page.account_settings"),
});

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
const NUMBER_OF_PAYMENTS_TO_SHOW = 25;

const { data: paymentsData, execute, pending } = useAsyncData("wallet-page-payments-data", async () => {
  if (!walletStore.wallet) {
    return;
  }

  const data = await $dependencies.wallets.ui.searchPaymentsOnTable.handle(walletStore.wallet.walletId, null, 0, NUMBER_OF_PAYMENTS_TO_SHOW);

  return data.payments;
}, {
  watch: [() => walletStore.wallet?.walletId, () => walletStore.balance],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
  default: () => [],
});

useEventBusSubscription("backend:events:payments:payment-status-updated", async () => {
  execute();
});
</script>

<template>
  <section class="bg-subtle rounded border border-muted/5 p-4">
    <h2 class="mb-4 text-lg font-medium">{{ $t('account.settings.wallet.transactions_title') }}</h2>
    <DataTableWalletPayments
      :title-empty="$t('account.settings.wallet.transactions_empty')"
      :payments="paymentsData ?? []"
      :loading="pending"
    />
  </section>
</template>
