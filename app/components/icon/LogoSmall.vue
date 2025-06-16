<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <div class="relative w-full pb-[87%] select-none">
    <NuxtImg
      class="w-full absolute left-0 top-0 object-cover"
      :src="siteStore.getAssetPath('logos/logo-sm.svg')"
      alt="Logo"
    />
  </div>
</template>
