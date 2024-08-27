<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-xl font-semibold text-center">
        {{ $t("modal_restrict.regional_headline") }}
      </h1>

      <div class="text-emphasis text-base text-center">
        {{ $t("modal_restrict.regional_body") }}
      </div>
    </div>
  </BaseModal>
</template>
