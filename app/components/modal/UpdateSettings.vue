<script setup lang="ts">
import type { PropType } from "vue";

const open = ref(true);

defineProps({
  setting: {
    type: String as PropType<"password">,
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
  </BaseModal>
</template>
