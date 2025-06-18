<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  identifier: string;
  // altText?: string;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();
</script>

<template>
  <NuxtPicture
    provider="custom_cloudflare"
    sizes="xs:220px sm:200px md:160px lg:145px"
    format="webp"
    :class="cn('block w-full h-full')"
    placeholder="/assets/logos/logo-sm.svg"
    :src="'/games/' + props.identifier + '.jpg'"
  />
</template>

<style scoped>
.hide-text {
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
}
</style>
