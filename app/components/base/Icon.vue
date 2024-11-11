<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <Icon
    :name="name"
    :size="size"
    mode="svg"
  />
</template>
