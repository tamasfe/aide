<script setup lang="ts">
import type { HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  label?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div class="bg-subtle text-subtle h-[var(--giro-input-height)]">
    <BaseInput
      v-bind="$attrs"
      variant="ghost"
      size="ghost"
      :class="[
        cn('w-full bg-transparent'),
        props.class,
      ]"
    />
  </div>
</template>
