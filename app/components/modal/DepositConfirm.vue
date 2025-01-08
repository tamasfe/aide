<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

const open = ref(true);
const loading = ref(false);
const { $dependencies } = useNuxtApp();

const props = defineProps<{
  code: string;
  amount: number;
  currency: WalletCurrency;
  paymentMethodId: number;
  paymentFlowId: number;
}>();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   - currently this is hardcoded for pix... eventually this needs to be generalized and refactored to support multiple payment methods/currencies/providers/jurisdictions
// TRANSLATION STATUS:  ✅

const createNewDeposit = async () => $dependencies.wallets.ui.createDepositFlowOnForm.handle(props.amount, props.currency, props.paymentMethodId);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="loading"
    :logo="false"
    banner="top"
    banner-top="/assets/images/banners/deposit_horizontal.jpg"
  >
    <FormDepositConfirm
      :key="paymentFlowId"
      :code="code"
      :amount="amount"
      :currency="currency"
      :create-new-deposit="createNewDeposit"
    />
  </BaseModal>
</template>
