<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

const loading = ref(false);

const userModule = useUserModule();

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
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
    @update:open="v => !v && onClosed()"
  >
    <FormForgotPassword />
  </BaseModal>
</template>
