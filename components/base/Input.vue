<script setup lang="ts">
withDefaults(defineProps<{
  type: string;
}>(), {
  type: "text",
});
</script>

<template>
  <input :type="type">
</template>
