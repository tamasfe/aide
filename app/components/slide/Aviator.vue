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
      :src="siteStore.getCdnAssetPath('slides/aviator.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
