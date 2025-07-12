<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <BaseLink
    :to="{
      path: '/games/pgsoft/fortune-tiger',
    }"
  >
    <NuxtImg
      provider="custom_cloudflare"
      sizes="550px md:750px"
      :src="siteStore.getRelativeAssetPath('slides/fortune-tiger.jpg')"
      alt=""
      class="rounded md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
