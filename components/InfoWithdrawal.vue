<script setup lang="ts">
import { PhArrowLeft, PhX } from "@phosphor-icons/vue";

const emit = defineEmits(["click:back", "click:close"]);

const goBack = () => {
  emit("click:back");
};

const close = () => {
  emit("click:close");
};
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="w-full flex items-center justify-between">
      <button
        type="button"
        class="outline-none text-subtle cursor-pointer"
        @click="goBack"
      >
        <PhArrowLeft :size="30" />
      </button>
      <h2 class="text-xl font-bold">Withdrawal Limits</h2>
      <button
        type="button"
        class="outline-none text-subtle cursor-pointer"
        @click="close"
      >
        <PhX :size="30" />
      </button>
    </div>
    <div class="w-full py-2 font-semibold flex flex-col space-y-4">
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Minimum Withdrawal</p>
        <p>R$ 20</p>
      </div>
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Maximum Withdrawal</p>
        <p>R$ 4,999</p>
      </div>
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Number of Withdrawals</p>
        <p>1 / Day</p>
      </div>
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Bets to Enable Withdrawal</p>
        <p>1.7 X</p>
      </div>
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Bets to Enable Withdrawal</p>
        <p>3 X</p>
      </div>
      <div class="w-full flex items-center justify-between">
        <p class="text-subtle">Minimum Withdrawal</p>
        <p>R$ 20</p>
      </div>
      <p class="text-subtle">
        When withdrawing funds from your account, please follow these rules to
        ensure a smooth and secure transaction process. The minimum withdrawal
        amount is specified on the website and may vary depending on the
        withdrawal method chosen. Withdrawals are processed only to the payment
        method originally used for depositing funds, unless otherwise specified
        or if the original method does not support withdrawals...
      </p>
    </div>
  </div>
</template>
