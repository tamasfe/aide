<script setup lang="ts">
const open = ref(true);
const loading = ref(true);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
    banner="top"
    :logo="true"
    :disabled="loading"
  >
    <div>this is text</div>
    <!-- <FormLogin /> -->
  </BaseModal>
</template>
