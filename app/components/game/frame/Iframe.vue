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

const iframeKey = ref(Date.now());

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

/**
 * Game providers are not in sync with User's wallet in real time,
 * so we force a refresh of the game when a payment succeeds.
 * Note: we do not use the wallet balance as it goes down with every bet, which the provider does keep track of.
 */
const paymentListenerId = ref<number | null>(null);
onMounted(() => {
  paymentListenerId.value = $dependencies.common.asyncMessagePublisher.subscribe(
    "girobet-backend:events:payments:payment-status-updated",
    async (event) => {
      if (event.data.status === "succeeded") {
        iframeKey.value = Date.now();
      }
    },
  );
});
onUnmounted(() => {
  if (paymentListenerId.value) {
    $dependencies.common.asyncMessagePublisher.unsubscribe(paymentListenerId.value);
    paymentListenerId.value = null;
  }
});
</script>

<template>
  <iframe
    :key="iframeKey"
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
