<script lang="ts" setup>
import { UserSettingsPaymentPix, type UserSettingsPaymentPixPropsI } from "~/modules/users/domain/UserSettingsPaymentPix";

const props = defineProps<{
  paymentConfig: null | UserSettingsPaymentPixPropsI;
  onClickChange: () => void;
}>();

const paymentSettings = computed(() => props.paymentConfig ? UserSettingsPaymentPix.new(props.paymentConfig) : null);
</script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.payment_settings')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.key_type')">
      <template #default>
        <div v-if="paymentSettings">
          <p>{{ paymentSettings.activeSettings.keyType || $t('dashboard.settings.account.payment_settings_key_type_not_set') }}</p>
        </div>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="onClickChange"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.key_value')">
      <template #default>
        <div v-if="paymentSettings">
          <p v-if="paymentSettings.activeSettings.keyType === 'CPF'">
            078.843.426-85
          </p>
          <p v-if="paymentSettings.activeSettings.keyType === 'EMAIL' || paymentSettings.activeSettings.keyType === 'PHONE' || paymentSettings.activeSettings.keyType === 'EVP'">
            {{ paymentSettings.activeSettings.keyValue || $t('dashboard.settings.account.payment_settings_key_type_not_set') }}
          </p>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
