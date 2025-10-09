<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <BaseLink
    :to="{
      path: '/games/spribe/aviator',
    }"
  >
    <NuxtImg
      fetchpriority="high"
      preload
      provider="custom_cloudflare"
      sizes="360px md:403px"
      format="webp"
      :src="siteStore.getRelativeAssetPath('slides/1.png')"
      alt=""
      class="block rounded md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
