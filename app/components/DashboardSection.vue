<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-8 px-4 sm:px-8 py-4 bg-subtle rounded-lg">
    <div class="text-xl text-white font-semibold">
      <h2>{{ title }}</h2>
    </div>
    <div class="flex flex-col gap-8 sm:gap-4">
      <slot />
    </div>
  </div>
</template>
