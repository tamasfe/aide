<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

const props = defineProps({
  currency: {
    type: String as PropType<WalletCurrency>,
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
  paymentMethod: {
    type: Object as PropType<components["schemas"]["UserWalletPaymentMethodResponse"]>,
    required: false,
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

const clipboard = useClipboard({
  source: props.walletId.toString(),
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="flex flex-col gap-4 w-full max-w-[30rem] bg-subtle rounded-lg p-4 border border-muted/5"
    >
      <div class="flex items-center justify-between gap-2 text-subtle text-sm">
        <BaseFlag
          country-code="BR"
        />
        <div class="flex-1">
          {{ currency }}
          <template v-if="paymentMethod">
            • {{ paymentMethod.name }}
          </template>
        </div>

        <BaseIcon
          v-if="clipboard.copied.value"
          name="lucide:circle-check-big"
          :size="14"
        />
        <BaseIcon
          v-else
          name="lucide:copy"
          :size="14"
        />
        <div class="cursor-pointer p-4 -m-4" @click="clipboard.copy()">
          #{{ walletId }}
        </div>
      </div>
      <div class="flex items-center justify-center text-3xl font-medium">
        <BaseCurrency
          :currency="currency as string"
          :value="balance"
        />
      </div>
      <div class="flex flex-row gap-4">
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
