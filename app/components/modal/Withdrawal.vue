<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const userUnlockedBalance = useWalletStore().wallet?.balanceUnlocked ?? null;

const walletStore = useWalletStore();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data: paymentMethodData } = await useAsyncData("user-modals-payment-method", async () => {
  if (!walletStore.wallet) {
    return null;
  }
  return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet.currency);
}, {
  watch: [() => walletStore.wallet?.currency],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
defineProps<{
  open: boolean;
}>();
const currency = ref<{
  code: WalletCurrency;
  countryCode: SupportedCountryFlagCode;
}>({
  code: "BRL",
  countryCode: "BR",
});
</script>

<template>
  <BaseModal
    :open="open"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/withdrawal_horizontal.jpg')"
    @close="onClosed"
  >
    <template #title>
      {{ $t('modal_payments.make_withdrawal') }}
    </template>
    <template #subtitle>
      {{ $t('modal_payments.make_withdrawal_subtitle') }}
    </template>

    <FormWithdrawal
      v-if="paymentMethodData?.withdrawalAmounts && paymentMethodData?.withdrawalAmounts"
      :payment-method-limits="paymentMethodData?.withdrawalAmounts"
      :payment-method-id="paymentMethodData?.id"
      :currency="currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
  </BaseModal>
</template>
