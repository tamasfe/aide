<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  gameIdentifier: {
    type: String,
    required: true,
  },
});

useComponentLifecycleTracker({
  mounted: {
    "frontend:events:games:game-session-started": { gameIdentifier: props.gameIdentifier },
  },
  unmounted: {
    "frontend:events:games:game-session-finished": { gameIdentifier: props.gameIdentifier },
  },
});
</script>

<template>
  <iframe
    :src="src"
    loading="eager"
    width="100%"
    height="100%"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    class="block border-0"
  />
</template>
