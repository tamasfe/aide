<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    maxElements: number;
    perPage: number;
    page: number;
  }>(),
  {
    perPage: 5,
  },
);
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full" />
  </div>
</template>
