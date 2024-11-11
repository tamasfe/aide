<script setup lang="ts">
const { $dependencies } = useNuxtApp();

const props = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
  iFrameUrl: {
    type: String,
    required: false,
  },
});

onMounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("girobet:events:games:game-session-started", {
    gameId: props.gameId,
  });
});

onUnmounted(() => {
  $dependencies.common.asyncMessagePublisher.emit("girobet:events:games:game-session-finished", {
    gameId: props.gameId,
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
