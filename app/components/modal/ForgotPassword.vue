<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

const loading = ref(false);

const { $dependencies } = useNuxtApp();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
</script>

<template>
  <BaseModal
    :open="open"
    :disabled="loading"
    banner="none"
    @close="onClosed"
  >
    <FormForgotPassword />
  </BaseModal>
</template>
