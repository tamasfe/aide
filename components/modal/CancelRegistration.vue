<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormCancelRegistration />
  </BaseModal>
</template>
