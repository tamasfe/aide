<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";
import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const userModule = useUserModule();
const siteStore = useSiteStore();
const walletStore = useWalletStore();
const walletModule = useWalletModule();

const userUnlockedBalance = walletStore.wallet?.balanceUnlocked ?? null;

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

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};

const { data: paymentMethods } = useAsyncData(
  "payment-methods",
  async () => walletModule.ui.findPreferredPaymentMethodsOnStoreRefresh.handle(
    walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET,
  ),
  {
    server: true,
    lazy: true,
  },
);
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
      v-if="paymentMethods"
      :payment-method-limits="paymentMethods.limits"
      :payment-method-id="paymentMethods.preferred.id"
      :currency="currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
    <BaseSkeleton
      v-else
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
