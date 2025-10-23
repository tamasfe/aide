<script setup lang="ts">
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { KycPayload } from "~/types/hooks";

const kyc = useKycModule();
const { t } = useI18n();
const logger = useLogger();
const nuxtApp = useNuxtApp();
const errorMessage = ref<string | null>(null);
const kycData = ref<KycPayload | null>(null);
const open = ref(false);

useActiveModals("kyc", open);

useRuntimeHook("frontend:command:modal:kyc:open", (data) => {
  kycData.value = data;
  open.value = true;
  errorMessage.value = null;
});

useRuntimeHook("frontend:command:modal:kyc:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:kyc:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:kyc:closed");
    kycData.value = null;
    errorMessage.value = null;
  }
});

const onError = (data: { error: string; code: string }) => {
  logger.error("Error on KYC process", InfrastructureError.newFromError({ code: data.code, provider: "sumsub" }, new Error(data.error)));
  errorMessage.value = t("account.settings.verification.error_submitting_kyc");
};

const onSubmitted = () => {
  errorMessage.value = null;
  logger.info("KYC process finished", { provider: kycData.value?.provider });
};
</script>

<template>
  <BaseModal
    v-model:open="open"
    :logo="false"
  >
    <BaseAlert
      v-if="errorMessage"
      class="mb-0.5 block h-auto"
      level="error"
      :message="errorMessage"
    />

    <KycIFrameSumsub
      v-if="kycData"
      class="-mt-4"
      :initial-access-token="kycData.accessToken"
      :applicant="kycData.applicantData"
      :renew-access-token="() => kyc.ui.renewAccessToken.handle()"
      @submitted="onSubmitted"
      @error="onError"
    />
  </BaseModal>
</template>
