<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

defineProps<{
  title?: string;
}>();
</script>

<template>
  <div>
    <div v-if="title">{{ title }}</div>

    <BaseInput v-bind="$attrs" />
  </div>
</template>
