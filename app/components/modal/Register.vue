<script setup lang="ts">
const open = ref(true);
const loading = ref(false);

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
    v-model:open="open"
    :disabled="loading"
    :close-on-click-outside="false"
    banner="left"
    banner-left="/assets/images/wheel-2-vertical.png"
    banner-top="/assets/images/wheel-2.png"
    @close="onClosed"
  >
    <FormRegister />
  </BaseModal>
</template>
