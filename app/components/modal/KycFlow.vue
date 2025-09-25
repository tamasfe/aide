<script setup lang="ts">
import { InfrastructureError } from "~/packages/result/infrastructure-error";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  initialAccessToken?: string;
  applicantData?: {
    email: string;
    phone: string;
    language: string;
  };
}>();

const errorMessage = ref<string | null>(null);

const onError = (data: { error: string; code: string }) => {
  $dependencies.common.logger.error("Error on KYC process", InfrastructureError.newFromError({ code: data.code, provider: "sumsub" }, new Error(data.error)));
  errorMessage.value = t("dashboard.settings.verification.error_submitting_kyc");
};

const onSubmitted = () => {
  errorMessage.value = null;
  $dependencies.common.logger.info("KYC process finished", { provider: "sumsub", applicant: props.applicantData });

  // TODO: decide whether we want to close the modal ourselves or let the user.
  // This will depend if the final success modal text has some instructions the user has to read or not. Closing it abrubtly may would not be good UX.

  // A good option would be to reload the page after X time has passed, so the user sees the updated KYC state. If we want to avoid a page reload: we will probably need a KYC pinia store that tracks the state of the KYC verification.

  // const DELAY_TO_ALLOW_USER_TO_READ = 3000;
  // setTimeout(() => router.go(0), DELAY_TO_ALLOW_USER_TO_READ);
};

const onClosed = () => {
  errorMessage.value = null;
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    :disabled="false"
    :open="open"
    :logo="false"
    @update:open="v => !v && onClosed()"
  >
    <BaseAlert
      v-if="errorMessage"
      class="mb-0.5 block h-auto"
      level="error"
      :message="errorMessage"
    />

    <KycIFrameSumsub
      v-if="props.applicantData && props.initialAccessToken"
      class="-mt-4"
      :initial-access-token="props.initialAccessToken"
      :applicant="props.applicantData"
      :renew-access-token="() => $dependencies.kyc.ui.renewAccessToken.handle()"
      @submitted="onSubmitted"
      @error="onError"
    />
  </BaseModal>
</template>
