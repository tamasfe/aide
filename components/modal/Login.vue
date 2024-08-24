<script setup lang="ts">
const open = ref(true);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
  >
    <div class="flex-1 px-6 sm:py-6">
      <FormLogin />
    </div>
  </BaseModal>
</template>
