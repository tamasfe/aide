<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const siteStore = useSiteStore();
const props = defineProps<{
  identifier: string;
  altText?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <picture :class="cn('block w-full h-full object-cover', props.class)">
    <template
      v-for="size in [
        { imageSize: '150w' as const, screenSize: '400px' },
        { imageSize: '300w' as const, screenSize: '900px' },
        { imageSize: '600w' as const, screenSize: null },
      ]"
      :key="size.imageSize"
    >
      <template v-for="format in ['webp' as const, 'jpeg' as const]" :key="format">
        <source
          :type="`image/${format}`"
          :alt="altText || ''"
          :media="size.screenSize ? `(max-width: ${size.screenSize})` : ''"
          :srcset="
            `${siteStore.getCdnGameImageUrl(props.identifier, { format, size: size.imageSize })}`"
        >
      </template>
    </template>
    <NuxtImg
      :src="siteStore.getCdnGameImageUrl(identifier)"
      :alt="altText || ''"
    />
  </picture>
</template>
