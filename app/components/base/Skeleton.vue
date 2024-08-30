<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
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
      { skeleton: loading },
      props.class,
    )"
  >
    <slot v-if="!loading" />
  </div>
</template>

<style scoped>
.skeleton {
  background-image: linear-gradient(
    -90deg,
    rgb(var(--giro-bg-subtle)) 0%,
    rgb(var(--giro-bg-emphasis)) 50%,
    rgb(var(--giro-bg-subtle)) 100%
  );
  background-size: 400% 400%;
  animation: 1.2s ease-in-out 0s infinite normal none running shimmer;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -135% 0%;
  }
}
</style>
