<script setup lang="ts">
import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const userUnlockedBalance = useWalletStore().wallet?.balanceUnlocked ?? null;

const walletStore = useWalletStore();
const userStore = useUserStore();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data: paymentMethodData } = await useAsyncData("user-modals-withdrawal-preferred-payment-method", async () => {
  if (!userStore.isAuthenticated) {
    return null;
  }
  return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
}, {
  watch: [() => walletStore.wallet?.currency, () => userStore.isAuthenticated],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
  dedupe: "defer",
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
    @update:open="v => !v && onClosed()"
  >
    <template #title>
      {{ $t('modal_payments.make_withdrawal') }}
    </template>
    <template #subtitle>
      {{ $t('modal_payments.make_withdrawal_subtitle') }}
    </template>

    <FormWithdrawal
      v-if="paymentMethodData"
      :payment-method-limits="paymentMethodData.limits"
      :payment-method-id="paymentMethodData?.id"
      :currency="currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
  </BaseModal>
</template>
