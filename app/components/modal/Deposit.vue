<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";
import type { AlertProps } from "../base/Alert.vue";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const paymentMethodsStore = useWalletPaymentMethodsStore();

const userModule = useUserModule();
const siteStore = useSiteStore();

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
      <div v-if="paymentMethodsStore.limits?.depositMin" class="flex items-center justify-between">
        <span>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
        <span class="text-right block space-x-2">
          <span>{{ $t('modal_deposit.minimum') }}:</span>
          <BaseCurrency
            class="inline"
            :value="paymentMethodsStore.limits?.depositMin"
            :currency="currency.code"
            variant="ghost"
          />
        </span>
      </div>
      <span v-else>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
    </template>
    <FormDeposit
      v-if="paymentMethodsStore.status === 'ready'"
      :amounts="{ min: paymentMethodsStore.limits.depositMin ?? null, max: paymentMethodsStore.limits.depositMax ?? null }"
      :currency="currency"
      :payment-methods="paymentMethodsStore.methods"
      :payment-method-id="paymentMethodsStore.preferred.id"
    />
    <BaseSkeleton
      v-else-if="paymentMethodsStore.status === 'loading'"
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
