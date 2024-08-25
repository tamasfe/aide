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
    :logo="true"
  >
    <div>this is text</div>
    <!-- <FormLogin /> -->
  </BaseModal>
</template>
