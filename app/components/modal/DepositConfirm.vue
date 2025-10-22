<script setup lang="ts">
import type { CustomError } from "~/packages/result";
import type { DepositConfirmPayload } from "~/types/hooks";

const siteStore = useSiteStore();
const wallet = useWalletModule();
const nuxtApp = useNuxtApp();
const deposit = ref<DepositConfirmPayload | null>(null);
const open = ref(false);
const logger = useLogger();

useRuntimeHook("frontend:command:modal:deposit-confirm:open", (data) => {
  deposit.value = data;
  open.value = true;
});

useRuntimeHook("frontend:command:modal:deposit-confirm:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

useRuntimeHook("backend:event:payment:status-updated", (event) => {
  if (event.data.flow_id === deposit.value?.flowId) {
    open.value = false;
  }
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:deposit-confirm:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:deposit-confirm:closed");
    deposit.value = null;
  }
});

const createNewDeposit = async () => {
  if (!deposit.value) {
    return "";
  }
  try {
    return await wallet.ui.createDepositFlowOnForm.handle(deposit.value.amount, deposit.value.currency, deposit.value.paymentMethodId);
  }
  catch (error) {
    logger.error("Failed to create deposit floww", error as CustomError);
    return "";
  }
};
</script>

<template>
  <BaseModal
    v-model:open="open"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/deposit_horizontal.jpg')"
  >
    <FormDepositConfirm
      v-if="deposit"
      :key="deposit.flowId"
      :code="deposit.paymentCode"
      :amount="deposit.amount"
      :currency="deposit.currency"
      :create-new-deposit="createNewDeposit"
    />
  </BaseModal>
</template>
