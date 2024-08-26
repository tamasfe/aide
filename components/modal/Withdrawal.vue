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
    :logo="false"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormWithdrawal />
  </BaseModal>
</template>
