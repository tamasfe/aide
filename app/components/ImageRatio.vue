<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue";

const props = withDefaults(defineProps<{
  aspectRatio: CSSProperties["aspectRatio"];
  class?: HTMLAttributes["class"];
}>(), {
  aspectRatio: "3/4",
});
</script>

<template>
  <NuxtImg
    src="/assets/images/games/2.png"
    alt=""
    :class="cn(
      'w-full object-cover object-center rounded-default',
      props.class,
    )"
    :style="{ aspectRatio: aspectRatio }"
  />
</template>
