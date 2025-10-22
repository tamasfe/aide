<script setup lang="ts">
import type { PaymentLimitTimeframe } from "~/modules/wallet/domain/PaymentLimits";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import { humanizeDuration } from "~/packages/translation/domain/humanize-duration";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  min: number | null;
  max: number | null;
  cooldownSeconds: number | null;
  currency: WalletCurrency;
  unlockedBalance: number | null;
  timeframeLimits: PaymentLimitTimeframe[];
}>();

const timeframesWithWithdrawalAmount = computed(() => {
  return props.timeframeLimits.filter(t => typeof t.withdrawalAmount === "number");
});

const timeframesWithWithdrawalCount = computed(() => {
  return props.timeframeLimits.filter(t => typeof t.withdrawalCount === "number");
});
</script>

<template>
  <div class="grid grid-cols-[max-content_max-content] auto-cols-min mb-6 text-base text-subtle leading-loose">
    <div v-if="min">
      {{ $t("withdrawal_limits.limits_minimum") }}
    </div>
    <div v-if="min" class="value">
      <BaseCurrency :value="min" :currency="currency" variant="ghost" />
    </div>

    <div v-if="max">
      {{ $t("withdrawal_limits.limits_maximum") }}
    </div>
    <div v-if="max" class="value">
      <BaseCurrency :value="max" :currency="currency" variant="ghost" />
    </div>

    <template v-if="timeframesWithWithdrawalAmount.length > 0">
      <div>{{ $t("withdrawal_limits.limits_timeframe_amount") }}</div>
      <div class="value">
        <span v-for="timeframe in timeframesWithWithdrawalAmount" :key="JSON.stringify(timeframe)" class="flex items-center">
          <BaseCurrency
            :value="timeframe.withdrawalAmount as number"
            :currency="currency"
            variant="ghost"
          /> /
          {{ humanizeDuration(timeframe.seconds, $t) }}
        </span>
      </div>
    </template>

    <template v-if="timeframesWithWithdrawalCount.length > 0">
      <div>{{ $t("withdrawal_limits.limits_timeframe_count") }}</div>
      <div class="value">
        <span v-for="timeframe in timeframesWithWithdrawalCount" :key="JSON.stringify(timeframe)">
          {{ timeframe.withdrawalCount }} /
          {{ humanizeDuration(timeframe.seconds, $t) }}
        </span>
      </div>
    </template>

    <div>{{ $t("withdrawal_limits.limits_bets_to_withdraw") }}</div>
    <div class="value">
      1x
    </div>

    <div v-if="unlockedBalance !== null">
      {{ $t("withdrawal_limits.unlocked_balance") }}
    </div>
    <div v-if="unlockedBalance !== null" class="value">
      <BaseCurrency :value="unlockedBalance" :currency="currency" variant="ghost" />
    </div>
  </div>
  <div class="flex flex-col">
    <div class="leading-relaxed text-sm text-subtle-light whitespace-pre-line">
      {{ $t('withdrawal_limits.summary') }}
    </div>
  </div>
</template>

<style scoped>
.value {
  @apply pl-6 text-white font-medium;
}
</style>
