<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <h2 class="text-xl font-semibold sm:text-2xl">
    {{ title }}
  </h2>
</template>
