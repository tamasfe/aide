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
      :src="siteStore.getAssetPath('images/slides/choose-girobet.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </BaseLink>
</template>
