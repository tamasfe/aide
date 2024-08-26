<script setup lang="ts">
const open = ref(true);
const loading = ref(false);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="loading"
    banner="left"
    banner-left="/assets/images/wheel-2-vertical.png"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormLogin />
  </BaseModal>
</template>
