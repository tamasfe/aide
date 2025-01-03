<script setup lang="ts">
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { SupportedCountryFlagCode } from "~/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { $dependencies } = useNuxtApp();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};

const currency = ref<{
  code: components["schemas"]["Currency"];
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
    banner-top="/assets/images/deposit_horizontal.jpg"
    @close="onClosed"
  >
    <FormDeposit
      v-if="limits && paymentMethodId"
      :amounts="{ min: limits.min, max: limits.max }"
      :currency="currency"
      :payment-method-id="paymentMethodId"
    />
  </BaseModal>
</template>
