<script setup lang="ts">
import type { PropType } from "vue";

const open = ref(true);

defineProps({
  setting: {
    type: String as PropType<"password" | "language" | "time_zone">,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();
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
  </BaseModal>
</template>
