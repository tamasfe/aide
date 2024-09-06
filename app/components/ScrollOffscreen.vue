<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center pl-[var(--giro-container-padding)] overflow-x-auto no-scrollbar',
        'lg:mx-auto lg:max-w-[var(--giro-container-max-width)]',
        props.class,
      )
    "
  >
    <div class="pr-[var(--giro-container-padding)]">
      <slot />
    </div>
  </div>
</template>
