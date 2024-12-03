<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{ open: boolean }>();

const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};

const currency = ref<{
  code: WalletCurrency;
  countryCode: SupportedCountryFlagCode;
}>({
  code: "BRL",
  countryCode: "BR",
});

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: paymentMethod } = await useAsyncData("deposit-modal-payment-method", async () => {
  if (!walletStore.wallet) {
    return null;
  }
  return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet.currency);
}, { watch: [() => walletStore.isInit], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <BaseModal
    :open="open"
    :disabled="false"
    :logo="false"
    banner="top"
    banner-top="/assets/images/deposit_horizontal.jpg"
    @close="onClosed"
  >
    <FormDeposit
      v-if="paymentMethod"
      :amounts="{ min: paymentMethod.depositAmounts.min, max: paymentMethod.depositAmounts.max }"
      :currency="currency"
      :payment-method-id="paymentMethod.id"
    />
  </BaseModal>
</template>
