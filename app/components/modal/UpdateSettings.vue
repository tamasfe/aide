<script setup lang="ts">
import type { PropType } from "vue";
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";

type ModalUpdateSettingsMode = Extract<UserInteractionModalState, { modal: "settings" }>["data"]["setting"];

const open = ref(true);

defineProps({
  setting: {
    type: String as PropType<ModalUpdateSettingsMode>,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();
const userSettingsStore = useUserSettingsStore();
const userStore = useUserStore();
const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-update-settings"
    v-model:open="open"
    :logo="false"
    @close="onClosed"
  >
    <template v-if="setting === 'username'" #title>
      {{ $t('modal_user_settings.username.title') }}
    </template>
    <template v-else-if="setting === 'password'" #title>
      {{ $t('modal_user_settings.password.title') }}
    </template>
    <template v-else-if="setting === 'language'" #title>
      {{ $t('modal_user_settings.language.title') }}
    </template>
    <template v-else-if="setting === 'time_zone'" #title>
      {{ $t('modal_user_settings.time_zone.title') }}
    </template>
    <template v-else-if="setting === 'payment_pix'" #title>
      {{ $t('modal_user_settings.payment_pix.title') }}
    </template>

    <FormSettingsPassword v-if="setting === 'password'" />
    <FormSettingsLocale v-if="setting === 'language'" />
    <FormSettingsTimeZone v-if="setting === 'time_zone'" />
    <FormSettingsUsername v-if="setting === 'username'" :initial="userStore.user?.username || ''" />
    <FormSettingsPixPayment
      v-if="setting === 'payment_pix' && userSettingsStore.settings"
      :payment-settings="userSettingsStore.settings.payment"
      :initial-data="userStore.user ? userStore.user : undefined"
    />
  </BaseModal>
</template>
