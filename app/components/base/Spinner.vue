<script setup lang="ts">
withDefaults(defineProps<{
  size?: number;
}>(), {
  size: 24,
});
</script>

<template>
  <Icon
    :size="size"
    name="tdesign:loading"
    class="animate-spin"
  />
</template>
