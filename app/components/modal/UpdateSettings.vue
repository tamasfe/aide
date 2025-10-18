<script setup lang="ts">
import type { PropType } from "vue";
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";

type ModalUpdateSettingsMode = Extract<UserInteractionModalState, { modal: "settings" }>["data"]["setting"];

defineProps({
  setting: {
    type: String as PropType<ModalUpdateSettingsMode>,
    required: false,
  },
  open: {
    type: Boolean,
    required: true,
  },
});

const userModule = useUserModule();
const userSettingsStore = useUserSettingsStore();
const userStore = useUserStore();
const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-update-settings"
    :open="open"
    :logo="false"
    @update:open="v => !v && onClosed()"
  >
    <template #title>
      <span v-if="setting === 'username'">
        {{ $t('modal_account_settings.username.title') }}
      </span>
      <span v-else-if="setting === 'password'">
        {{ $t('modal_account_settings.password.title') }}
      </span>
      <span v-else-if="setting === 'language'">
        {{ $t('modal_account_settings.language.title') }}
      </span>
      <span v-else-if="setting === 'time_zone'">
        {{ $t('modal_account_settings.time_zone.title') }}
      </span>
      <span v-else-if="setting === 'payment_pix'">
        {{ $t('modal_account_settings.payment_pix.title') }}
      </span>
    </template>

    <FormSettingsPassword v-if="setting === 'password'" />
    <FormSettingsLocale v-if="setting === 'language'" />
    <FormSettingsTimeZone v-if="setting === 'time_zone'" />
    <FormSettingsUsername v-if="setting === 'username'" :initial="userStore.user?.username || ''" />
    <FormSettingsPixPayment
      v-if="setting === 'payment_pix' && userSettingsStore.settings"
      :payment-settings="userSettingsStore.settings.payment"
      :initial-data="userStore.user ? {
        email: userStore.user.email,
        phone: userStore.user.phone,
      }: undefined"
    />
  </BaseModal>
</template>
