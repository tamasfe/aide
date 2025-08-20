<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

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
  limits: null | { min: number | null; max: number | null };
  paymentMethodId: null | number;
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
      <div v-if="limits && limits.min" class="flex items-center justify-between">
        <span>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
        <span class="text-right block space-x-2">
          <span>Minimum:</span>
          <BaseCurrency
            class="inline"
            :value="limits.min"
            :currency="currency.code"
            variant="ghost"
          />
        </span>
      </div>
      <span v-else>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
    </template>
    <FormDeposit
      v-if="limits && paymentMethodId"
      :amounts="{ min: limits.min, max: limits.max }"
      :currency="currency"
      :payment-method-id="paymentMethodId"
    />
  </BaseModal>
</template>
