<script setup lang="ts">
const open = ref(true);
const loading = ref(false);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   - currently this is hardcoded for pix... eventually this needs to be generalized and refactored to support multiple payment methods/currencies/providers/jurisdictions
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
    <FormDepositConfirm />
  </BaseModal>
</template>
