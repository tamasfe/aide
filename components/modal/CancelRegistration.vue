<script setup lang="ts">
const open = ref(true);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormDeposit />
  </BaseModal>
</template>
