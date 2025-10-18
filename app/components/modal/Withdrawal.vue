<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const userModule = useUserModule();
const siteStore = useSiteStore();
const walletStore = useWalletStore();

const userUnlockedBalance = walletStore.wallet?.balanceUnlocked ?? null;
const paymentMethodsStore = useWalletPaymentMethodsStore();

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
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
      v-if="paymentMethodsStore.status === 'ready'"
      :payment-method-limits="paymentMethodsStore.limits"
      :payment-method-id="paymentMethodsStore.preferred.id"
      :currency="currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
    <BaseSkeleton
      v-else-if="paymentMethodsStore.status === 'loading'"
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
