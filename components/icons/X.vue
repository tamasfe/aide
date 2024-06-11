<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  size?: number;
}>();

const size = computed(() => {
  return props.size || 24;
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 8L8 24"
      stroke="#7B82C0"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 8L24 24"
      stroke="#7B82C0"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
