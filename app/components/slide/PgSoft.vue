<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <BaseLink
    :to="{
      path: '/games/pgsoft',
    }"
  >
    <NuxtImg
      fetchpriority="high"
      preload
      provider="custom_cloudflare"
      sizes="550px md:750px"
      format="webp"
      :src="siteStore.getRelativeAssetPath('slides/3.png')"
      alt=""
      class="rounded md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
