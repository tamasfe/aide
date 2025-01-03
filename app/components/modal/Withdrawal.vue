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
defineProps<{
  limits: null | { min: number | null; max: number | null; cooldownSeconds: number | null };
  paymentMethodId: null | number;
  open: boolean;
}>();
const currency = ref<{
  code: components["schemas"]["Currency"];
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
    banner-top="/assets/images/withdrawal_horizontal.jpg"
    @close="onClosed"
  >
    <FormWithdrawal
      v-if="limits && paymentMethodId"
      :limits="limits"
      :payment-method-id="paymentMethodId"
      :currency="currency"
    />
  </BaseModal>
</template>
