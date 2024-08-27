<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✴️
</script>

<template>
  <div class="grid grid-cols-[max-content_max-content] auto-cols-min mb-6 text-base text-subtle leading-loose">
    <div>Minimum Withdrawal</div>
    <div class="value">R$ 20</div>
    <div>Maximum Withdrawal</div>
    <div class="value">R$ 4,999</div>
    <div>Number of Withdrawals</div>
    <div class="value">1/day</div>
    <div>Bets to Enable Withdrawal</div>
    <div class="value">1.7x</div>
  </div>
  <div class="flex flex-col">
    <div class="leading-relaxed text-[0.78rem] text-subtle-light">{{ $t('withdrawal_limits.summary') }}</div>
  </div>
</template>

<style scoped>
.value {
  @apply pl-6 text-white font-medium;
}
</style>
