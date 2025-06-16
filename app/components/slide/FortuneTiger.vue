<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <BaseLink
    :to="{
      path: '/games/pgsoft/fortune-rabbit',
    }"
  >
    <NuxtImg
      :src="siteStore.getCdnAssetPath('slides/fortune-tiger.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
