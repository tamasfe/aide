<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";
import type { AlertProps } from "../base/Alert.vue";
import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const userModule = useUserModule();
const walletModule = useWalletModule();
const siteStore = useSiteStore();
const walletStore = useWalletStore();

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};

const currency = ref<{
  code: WalletCurrency;
  countryCode: SupportedCountryFlagCode;
}>({
  code: "BRL",
  countryCode: "BR",
});

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

defineProps<{
  open: boolean;
  alert?: AlertProps;
}>();
</script>

<template>
  <BaseModal
    :open="open"
    :disabled="false"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/deposit_horizontal.jpg')"
    :alert="alert"
    @update:open="v => !v && onClosed()"
  >
    <template #title>
      {{ $t('modal_payments.make_deposit') }}
    </template>
    <template #subtitle>
      <div v-if="paymentMethods?.limits?.depositMin" class="flex items-center justify-between">
        <span>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
        <span class="text-right block space-x-2">
          <span>{{ $t('modal_deposit.minimum') }}:</span>
          <BaseCurrency
            class="inline"
            :value="paymentMethods.limits?.depositMin"
            :currency="currency.code"
            variant="ghost"
          />
        </span>
      </div>
      <span v-else>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
    </template>

    <FormDeposit
      v-if="paymentMethods"
      :amounts="{ min: paymentMethods.limits.depositMin ?? null, max: paymentMethods.limits.depositMax ?? null }"
      :currency="currency"
      :payment-methods="paymentMethods.methods"
      :payment-method-id="paymentMethods.preferred.id"
    />

    <BaseSkeleton
      v-else
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
