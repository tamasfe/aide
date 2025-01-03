<script setup lang="ts">
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  min: number | null;
  max: number | null;
  cooldownSeconds: number | null;
  currency: components["schemas"]["Currency"];
}>();

const secondsToDayFrequency = (seconds: number) => {
  return Math.round(1 / (seconds / (60 * 60 * 24)) * 10) / 10;
};
</script>

<template>
  <div class="grid grid-cols-[max-content_max-content] auto-cols-min mb-6 text-base text-subtle leading-loose">
    <div v-if="min">{{ $t("withdrawal_limits.limits_minimum") }}</div>
    <div v-if="min" class="value">
      <BaseCurrency :value="min" :currency="currency" variant="ghost" />
    </div>

    <div v-if="max">{{ $t("withdrawal_limits.limits_maximum") }}</div>
    <div v-if="max" class="value">
      <BaseCurrency :value="max" :currency="currency" variant="ghost" />
    </div>

    <div v-if="cooldownSeconds">{{ $t("withdrawal_limits.limits_amount") }}</div>
    <div v-if="cooldownSeconds" class="value">{{ secondsToDayFrequency(cooldownSeconds) }}/day</div>

    <div>{{ $t("withdrawal_limits.limits_bets_to_withdraw") }}</div>
    <div class="value">1.7x</div>
  </div>
  <div class="flex flex-col">
    <div class="leading-relaxed text-sm text-subtle-light">{{ $t('withdrawal_limits.summary') }}</div>
  </div>
</template>

<style scoped>
.value {
  @apply pl-6 text-white font-medium;
}
</style>
