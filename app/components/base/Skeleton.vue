<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
//   * could look a little fancier...
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  loading: boolean;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(
      { 'animate-[pulse_1.2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-white/5': loading },
      props.class,
    )"
  >
    <slot v-if="!loading" />
  </div>
</template>
