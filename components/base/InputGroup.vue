<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// TODO
// * floating label
// * error (right aligned under input)
// * jiggle animation on error
// * font/end dropcaps
// * maska

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
