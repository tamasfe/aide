<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue";

const siteStore = useSiteStore();

const props = withDefaults(defineProps<{
  aspectRatio?: CSSProperties["aspectRatio"];
  class?: HTMLAttributes["class"];
}>(), {
  aspectRatio: "3/4",
});
</script>

<template>
  <NuxtImg
    :src="siteStore.getAssetPath('images/games/2.png')"
    alt=""
    :class="cn(
      'block w-full h-auto flex-shrink-0 object-cover object-center',
      props.class,
    )"
    :style="{ aspectRatio: aspectRatio }"
  />
</template>
