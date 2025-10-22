<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();
const wallet = useWalletModule();

definePageMeta({
  middleware: ["authenticated", "active-wallet"],
});

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

  const data = await wallet.ui.searchPaymentsOnTable.handle(walletStore.wallet.wallet_id, null, 0, NUMBER_OF_PAYMENTS_TO_SHOW);

  return data.payments;
}, {
  watch: [() => walletStore.wallet?.wallet_id, () => walletStore.balance],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
  default: () => [],
});

useRuntimeHook("backend:event:payment:status-updated", async () => {
  execute();
});
</script>

<template>
  <section class="bg-subtle rounded border border-muted/5 p-4">
    <h2 class="mb-4 text-lg font-medium">
      {{ $t('account.settings.wallet.transactions_title') }}
    </h2>
    <DataTableWalletPayments
      :title-empty="$t('account.settings.wallet.transactions_empty')"
      :payments="paymentsData ?? []"
      :loading="pending"
    />
  </section>
</template>
