<script setup lang="ts">
import type { FindUserKycStatusResponseI } from "~/modules/kyc/infra/ui/FindUserKycStatusOnAccountVerification";

const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: kycResponse } = await useAsyncData("dashboard-settings-verification-kyc",
  async () => $dependencies.kyc.ui.findUserKycStatus.handle(),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const onClickUpload = (responseData: Exclude<FindUserKycStatusResponseI["data"], null>) => $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: "kyc", data: responseData });
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('dashboard.settings.verification.identity') }}
    </template>
    <template #description>
      <p v-if="kycResponse?.status === 'INACTIVE'">
        {{ $t('dashboard.settings.verification.kyc_missing') }}
      </p>
      <p v-if="kycResponse?.status === 'ACTIVE'">
        {{ $t('dashboard.settings.verification.kyc_active') }}
      </p>
    </template>
    <ClientOnly>
      <div v-if="!kycResponse" class="py-6 w-full flex items-center justify-center">
        <BaseSpinner />
      </div>
      <div v-if="kycResponse?.status === 'INACTIVE'" class="space-y-8">
        <BaseButton
          variant="primary"
          size="dashboard"
          class="h-9 md:h-10 w-fit gap-2"
          @click="onClickUpload(kycResponse.data)"
        >
          <BaseIcon
            name="lucide:upload"
            :size="18"
          />
          {{ $t('button.upload') }}
        </BaseButton>
      </div>
    </ClientOnly>
  </DashboardSection>
</template>
