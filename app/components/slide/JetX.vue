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
      sizes="800px sm:1000px md:1500px lg:2000px"
      :src="siteStore.getCdnAssetPath('slides/jet-x.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
