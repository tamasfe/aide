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
    id="base-modal-login"
    v-model:open="open"
    :disabled="loading"
    banner="left"
    banner-left="/assets/images/login_vertical.jpg"
    banner-top="/assets/images/login_horizontal.jpg"
    @close="onClosed"
  >
    <FormLogin />
  </BaseModal>
</template>
