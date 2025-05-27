<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const siteStore = useSiteStore();
const props = defineProps<{
  identifier: string;
  // altText?: string;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();

const fallbackImgSrc = ref(siteStore.getCdnGameImageUrl(props.identifier, { size: "100w", quality: "50", format: "webp" }));
</script>

<template>
  <picture :class="cn('block w-full h-full object-cover hide-text', props.class)">
    <!-- Only show sources if image exists or hasn't been tested yet -->
    <!-- Mobile: up to 400px -->
    <source
      media="(max-width: 400px)"
      type="image/webp"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'webp', size: '200w' })"
    >
    <source
      media="(max-width: 400px)"
      type="image/jpeg"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'jpeg', size: '200w' })"
    >

    <!-- Tablet: 401px to 900px -->
    <source
      media="(max-width: 900px)"
      type="image/webp"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'webp', size: '300w' })"
    >
    <source
      media="(max-width: 900px)"
      type="image/jpeg"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'jpeg', size: '300w' })"
    >

    <!-- Desktop: above 900px -->
    <source
      type="image/webp"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'webp', size: '600w' })"
    >
    <source
      type="image/jpeg"
      :srcset="siteStore.getCdnGameImageUrl(props.identifier, { format: 'jpeg', size: '600w' })"
    >

    <!-- alt has to be empty on fallback, to prevent the "broken image" icon from showing -->
    <NuxtImg
      :class="cn('block w-full h-full')"
      :style="{ 'background-image': 'url(' + siteStore.getAssetPath('images/logos/logo-sm.svg') + ')',
                'background-size': '60%',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
      }"
      :src="fallbackImgSrc"
      alt=""
    />
  </picture>
</template>

<style scoped>
.hide-text {
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
}
</style>
