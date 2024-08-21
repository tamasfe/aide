<script setup lang="ts">
const authenticated = ref(false);
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <BasePromoBar />

    <WrapperAuthenticatedHeader v-if="authenticated" />
    <WrapperPublicHeader v-else />
  </nav>
</template>
