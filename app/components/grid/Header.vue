<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-4', props.class)">
    <div class="flex items-center justify-between">
      <slot
        v-if="$slots.title"
        name="title"
      />

      <slot name="options" />
    </div>

    <slot />
  </div>
</template>
