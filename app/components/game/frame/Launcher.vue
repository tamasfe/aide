<script setup lang="ts">
const { $dependencies } = useNuxtApp();

const props = defineProps({
  gameIdentifier: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

/**
 * A game session starts when the iframe is mounted, and stops when it is unmounted.
 * It can also "restart" if reloaded
 */

onMounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("frontend:events:games:game-session-started", {
    gameIdentifier: props.gameIdentifier,
  });
});
onUnmounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("frontend:events:games:game-session-finished", {
    gameIdentifier: props.gameIdentifier,
  });
});
</script>

<template>
  <BaseIframe id="game-iframe" :src="src" />
</template>
