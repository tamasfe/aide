<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  onSubmit?: (e?: Event) => void;
}>();
</script>

<template>
  <form
    v-bind="$attrs"
    :class="cn('w-full flex flex-col gap-2', props.class)"
    @submit="props.onSubmit"
  >
    <slot />
  </form>
</template>
