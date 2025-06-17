<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const userUnlockedBalance = useWalletStore().wallet?.balanceUnlocked ?? null;

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
defineProps<{
  limits: null | { min: number | null; max: number | null; cooldownSeconds: number | null };
  paymentMethodId: null | number;
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
      v-if="limits && paymentMethodId"
      :payment-method-limits="limits"
      :payment-method-id="paymentMethodId"
      :currency="currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
  </BaseModal>
</template>
