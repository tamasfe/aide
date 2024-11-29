<script setup lang="ts">
defineProps({
  currency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  walletId: {
    type: Number,
    required: true,
  },
  onClickDeposit: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
  onClickWithdraw: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col gap-4 w-full max-w-[30rem] bg-subtle rounded-default p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseFlag
            country-code="BR"
            size="md"
          />
          <div class="text-subtle">{{ currency }}</div>
        </div>

        <div class="text-subtle text-sm">#{{ walletId }}</div>
      </div>
      <div class="flex items-center justify-center text-3xl font-medium">
        <BaseCurrency
          :currency="currency"
          :value="balance"
        />
      </div>
      <div class="flex flex-row gap-3">
        <BaseButton
          variant="secondary"
          size="md"
          class="w-full"
          @click="onClickWithdraw"
        >
          {{ $t('button.withdraw') }}
        </BaseButton>

        <BaseButton
          variant="emphasis"
          size="md"
          class="w-full"
          @click="onClickDeposit"
        >
          {{ $t('button.deposit') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
