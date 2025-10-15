<script lang="ts" setup>
import { UserSettingsPaymentPix, type UserSettingsPaymentPixPropsI } from "~/modules/users/domain/UserSettingsPaymentPix";

const props = defineProps<{
  paymentConfig: null | UserSettingsPaymentPixPropsI;
  cpf: null | string;
  onClickChange: () => void;
}>();

const paymentSettings = computed(() => props.paymentConfig ? UserSettingsPaymentPix.new(props.paymentConfig) : null);
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('account.settings.account.payment_settings') }}
    </template>

    <DashboardSectionItem :name="$t('account.settings.account.key_type')">
      <template #default>
        <div v-if="paymentSettings">
          <p>
            {{ $t(`account_settings.payment.pix_key_type.${paymentSettings.activeSettings.keyType}`, paymentSettings.activeSettings.keyType || '')
              || $t('account.settings.account.payment_settings_key_type_not_set')
            }}
          </p>
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
    <DashboardSectionItem :name="$t('account.settings.account.key_value')">
      <template #default>
        <div v-if="paymentSettings">
          <p v-if="paymentSettings.activeSettings.keyType === 'CPF'">
            {{ cpf || '' }}
          </p>
          <p v-if="paymentSettings.activeSettings.keyType === 'EMAIL' || paymentSettings.activeSettings.keyType === 'PHONE' || paymentSettings.activeSettings.keyType === 'EVP'">
            {{ paymentSettings.activeSettings.keyValue || $t('account.settings.account.payment_settings_key_type_not_set') }}
          </p>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
