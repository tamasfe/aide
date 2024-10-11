<script setup lang="ts">
const open = ref(true);
const loading = ref(false);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { $dependencies } = useNuxtApp();
const onClosed = () => {
  $dependencies.common.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});
};
</script>

<template>
  <BaseModal
    id="base-modal-login"
    v-model:open="open"
    :disabled="loading"
    banner="left"
    banner-left="/assets/images/wheel-2-vertical.png"
    banner-top="/assets/images/wheel-2.png"
    @close="onClosed"
  >
    <FormLogin />
  </BaseModal>
</template>
