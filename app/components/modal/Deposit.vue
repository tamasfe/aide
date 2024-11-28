<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    :open="true"
    :disabled="false"
    :logo="false"
    banner="top"
    banner-top="/assets/images/deposit_horizontal.jpg"
    @close="onClosed"
  >
    <FormDeposit />
  </BaseModal>
</template>
