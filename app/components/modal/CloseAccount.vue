<script setup lang="ts">
const open = ref(true);

defineProps({});

const { $dependencies } = useNuxtApp();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-close-account"
    v-model:open="open"
    :logo="false"
    @close="onClosed"
  >
    <FormCloseAccount />
  </BaseModal>
</template>
