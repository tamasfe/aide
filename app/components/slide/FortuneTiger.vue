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
      sizes="sm:600px md:400px lg:410px"
      :src="siteStore.getRelativeAssetPath('slides/fortune-tiger.jpg')"
      alt=""
      class="rounded md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
