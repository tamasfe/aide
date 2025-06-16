<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <div class="relative w-full pb-[20.41%] select-none">
    <NuxtImg
      class="w-full absolute left-0 top-0 object-cover"
      :src="siteStore.getFrontendAssetPath('logos/logo.svg')"
      alt="Logo"
    />
  </div>
</template>
