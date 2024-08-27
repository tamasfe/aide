<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
}>();

const loadingClass = computed(() => {
  return props.loading ? "giro__skeleton" : "";
});
</script>

<template>
  <div :class="loadingClass">
    <slot v-if="!loading" />
  </div>
</template>

<style scoped>
.giro__skeleton {
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
