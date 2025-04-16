<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const siteStore = useSiteStore();
const props = defineProps<{
  src: string | null;
  altText?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn('flex items-center justify-center h-full', props.class)">
    <NuxtImg
      :src="src || siteStore.getAssetPath('images/logos/logo-sm.svg')"
      :alt="altText || ''"
      :class="props.src ? 'block w-full h-full object-cover': 'px-8 block w-full h-full'"
    />
  </div>
</template>
