<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const walletStore = useWalletStore();

const ENABLE_SERVER_SIDE_RENDERING = false;
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
  dedupe: "defer",
});

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();

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

defineProps<{
  open: boolean;
}>();
</script>

<template>
  <BaseModal
    :open="open"
    :disabled="false"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/deposit_horizontal.jpg')"
    @close="onClosed"
  >
    <template #title>
      {{ $t('modal_payments.make_deposit') }}
    </template>
    <template #subtitle>
      <div v-if="paymentMethodData?.depositAmounts && paymentMethodData?.depositAmounts.min" class="flex items-center justify-between">
        <span>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
        <span class="text-right block space-x-2">
          <span>{{ $t('modal_deposit.minimum') }}:</span>
          <BaseCurrency
            class="inline"
            :value="paymentMethodData?.depositAmounts.min"
            :currency="currency.code"
            variant="ghost"
          />
        </span>
      </div>
      <span v-else>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
    </template>
    <FormDeposit
      v-if="paymentMethodData?.depositAmounts && paymentMethodData.id"
      :amounts="{ min: paymentMethodData?.depositAmounts.min, max: paymentMethodData?.depositAmounts.max }"
      :currency="currency"
      :payment-method-id="paymentMethodData.id"
    />
  </BaseModal>
</template>
