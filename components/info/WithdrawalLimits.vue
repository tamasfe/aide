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
    <div>Minimum Withdrawal</div>
    <div class="value">R$ 20</div>
  </div>
  <div class="flex flex-col">
    <div class="leading-relaxed text-[0.78rem] text-subtle-light">When withdrawing funds from your account, please follow these rules to ensure a smooth and secure transaction process. The minimum withdrawal amount is specified on the website and may vary depending on the withdrawal method chosen. Withdrawals are processed only to the payment method originally used for depositing funds, unless otherwise specified or if the original method does not support withdrawals...</div>
  </div>
</template>

<style scoped>
.value {
  @apply pl-6 text-white font-medium;
}
</style>
