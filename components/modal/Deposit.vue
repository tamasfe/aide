<script setup lang="ts">
const open = ref(true);
const loading = ref(false);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="loading"
    :close-on-click-outside="false"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormDeposit />
  </BaseModal>
</template>
