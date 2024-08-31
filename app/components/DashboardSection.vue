<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="px-4 sm:px-8 py-4 space-y-8 bg-subtle rounded-2xl">
    <div class="text-[1.137rem] font-bold">
      <h2>{{ title }}</h2>
    </div>
    <div class="space-y-8 sm:space-y-4">
      <slot />
    </div>
  </div>
</template>
