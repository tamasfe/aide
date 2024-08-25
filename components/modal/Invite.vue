<script setup lang="ts">
const open = ref(true);
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <FormInvite />
  </BaseModal>
</template>
