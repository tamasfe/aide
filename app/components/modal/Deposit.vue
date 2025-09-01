<script setup lang="ts">
import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const walletStore = useWalletStore();
const userStore = useUserStore();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = false;

const [{ data: paymentMethodData }, { data: paymentMethods }] = await Promise.all([
  useAsyncData("user-modals-deposit-preferred-payment-method", async () => {
    if (!userStore.isAuthenticated) {
      return null;
    }
    return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
  }, {
    watch: [() => walletStore.wallet?.currency, () => userStore.isAuthenticated],
    lazy: DEFER_CLIENT_SIDE_LOADING,
    server: ENABLE_SERVER_SIDE_RENDERING,
    dedupe: "defer",
  }),

  useAsyncData("user-modals-deposit-payment-methods", async () => {
    if (!userStore.isAuthenticated) {
      return null;
    }
    return await $dependencies.wallets.ui.searchPaymentMethodsOnDepositForm.handle(walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
  }, {
    watch: [() => walletStore.wallet?.currency, () => userStore.isAuthenticated],
    lazy: DEFER_CLIENT_SIDE_LOADING,
    server: ENABLE_SERVER_SIDE_RENDERING,
    dedupe: "defer",
  }),
]);

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
      :payment-methods="paymentMethods || []"
      :payment-method-id="paymentMethodData.id"
    />
  </BaseModal>
</template>
