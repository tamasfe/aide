<script setup lang="ts">
withDefaults(defineProps<{
  size?: number;
}>(), {
  size: 36,
});
</script>

<template>
  <BaseIcon
    :size="size"
    name="tdesign:loading"
    class="animate-spin"
  />
</template>
