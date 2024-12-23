<script setup lang="ts">
import type { PropType } from "vue";

type ModalUpdateSettingsMode = "password" | "language" | "time_zone" | "payment_pix";

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
    <FormSettingsPassword v-if="setting === 'password'" />
    <FormSettingsLocale v-if="setting === 'language'" />
    <FormSettingsTimeZone v-if="setting === 'time_zone'" />
    <FormSettingsPixPayment
      v-if="setting === 'payment_pix' && userSettingsStore.settings"
      :payment-settings="userSettingsStore.settings.payment"
      :initial-data="userStore.user ? userStore.user : undefined"
    />
  </BaseModal>
</template>
