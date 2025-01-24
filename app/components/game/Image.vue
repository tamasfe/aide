<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  src: string;
  altText?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn('flex items-center justify-center h-full', props.class)">
    <NuxtImg
      :src="src"
      :alt="altText || ''"
      class="block w-full h-full object-cover"
    />
  </div>
</template>
