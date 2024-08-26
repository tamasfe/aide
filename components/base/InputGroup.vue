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
  <div class="h-[var(--giro-input-height)] rounded-default bg-subtle text-subtle">
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
