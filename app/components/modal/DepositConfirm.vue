<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();

const props = defineProps<{
  open: boolean;
  payment?: {
    paymentCode: string;
    amount: number;
    currency: WalletCurrency;
    paymentMethodId: number;
    flowId: number;
  };
}>();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   - currently this is hardcoded for pix... eventually this needs to be generalized and refactored to support multiple payment methods/currencies/providers/jurisdictions
// TRANSLATION STATUS:  ✅

const createNewDeposit = async () => {
  if (!props.payment) {
    return "";
  }
  return $dependencies.wallets.ui.createDepositFlowOnForm.handle(props.payment.amount, props.payment.currency, props.payment.paymentMethodId);
};
</script>

<template>
  <BaseModal
    :open="open"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getAssetPath('images/banners/deposit_horizontal.jpg')"
  >
    <FormDepositConfirm
      v-if="payment"
      :key="payment.flowId"
      :code="payment.paymentCode"
      :amount="payment.amount"
      :currency="payment.currency"
      :create-new-deposit="createNewDeposit"
    />
  </BaseModal>
</template>
