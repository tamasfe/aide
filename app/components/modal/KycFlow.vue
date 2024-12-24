<script setup lang="ts">
import { InfrastructureError } from "~/packages/result/infrastructure-error";

const { $dependencies } = useNuxtApp();

const open = ref(true);
const props = defineProps<{
  initialAccessToken: string;
  applicantData: {
    email: string;
    phone: string;
    language: string;
  };
}>();

const onError = (data: { error: string; code: string }) => {
  $dependencies.common.logger.error("Error on KYC process", InfrastructureError.newFromError({ code: data.code, provider: "sumsub" }, new Error(data.error)));
};

const onSubmitted = () => {
  $dependencies.common.logger.info("KYC process finished", { provider: "sumsub", applicant: props.applicantData });

  // TODO: decide whether we want to close the modal ourselves or let the user.
  // This will depend if the final success modal text has some instructions the user has to read or not. Closing it abrubtly may would not be good UX.

  // A good option would be to reload the page after X time has passed, so the user sees the updated KYC state. If we want to avoid a page reload: we will probably need a KYC pinia store that tracks the state of the KYC verification.

  // const DELAY_TO_ALLOW_USER_TO_READ = 3000;
  // setTimeout(() => router.go(0), DELAY_TO_ALLOW_USER_TO_READ);
};
</script>

<template>
  <BaseModal
    :disabled="false"
    :open="open"
    :logo="false"
    @close="() => $dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
  >
    <KycIFrameSumsub
      :initial-access-token="props.initialAccessToken"
      :applicant="props.applicantData"
      :renew-access-token="() => $dependencies.kyc.ui.renewAccessToken.handle()"
      @submitted="onSubmitted"
      @error="onError"
    />
  </BaseModal>
</template>
