<script setup lang="ts">
import type { HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  title?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div>
    <div v-if="title">{{ title }}</div>

    <BaseInput
      v-bind="$attrs"
      :class="[
        cn('w-full'),
        props.class,
      ]"
    />
  </div>
</template>
