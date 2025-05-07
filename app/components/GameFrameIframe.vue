<script setup lang="ts">
const { $dependencies } = useNuxtApp();

const props = defineProps({
  gameIdentifier: {
    type: String,
    required: true,
  },
  iFrameUrl: {
    type: String,
    required: false,
  },
});

onMounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("girobet:events:games:game-session-started", {
    gameIdentifier: props.gameIdentifier,
  });
});

onUnmounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("girobet:events:games:game-session-finished", {
    gameIdentifier: props.gameIdentifier,
  });
});
</script>

<template>
  <iframe
    :src="iFrameUrl"
    loading="eager"
    width="100%"
    height="100%"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    class="block border-0"
  />
</template>
