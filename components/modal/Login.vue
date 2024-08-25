<script setup lang="ts">
const open = ref(true);
const loading = ref(false);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="loading"
    :close-on-click-outside="false"
    banner="left"
    banner-left="/assets/images/wheel-2-vertical.png"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormLogin />
  </BaseModal>
</template>
