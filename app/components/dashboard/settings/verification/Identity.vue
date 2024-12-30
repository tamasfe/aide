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
  <DashboardSection :title="$t('dashboard.settings.verification.identity')">
    <ClientOnly>
      <div v-if="!kycResponse" class="py-6 w-full flex items-center justify-center">
        <BaseSpinner />
      </div>
      <div class="space-y-8" v-if="kycResponse?.status === 'ACTIVE'">
        <p>
          {{ $t('dashboard.settings.verification.kyc_active') }}
        </p>
      </div>
      <div class="space-y-8" v-if="kycResponse?.status === 'INACTIVE'">
        <p>
          {{ $t('dashboard.settings.verification.kyc_missing') }}
        </p>

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
