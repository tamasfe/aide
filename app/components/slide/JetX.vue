<script setup lang="ts">
const siteStore = useSiteStore();
</script>

<template>
  <BaseLink
    :to="{
      name: 'todo',
    }"
  >
    <NuxtImg
      provider="custom_cloudflare"
      sizes="sm:600px md:400px lg:410px"
      :src="siteStore.getRelativeAssetPath('slides/jet-x.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
