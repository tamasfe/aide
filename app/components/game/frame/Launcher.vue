<script setup lang="ts">
const { $dependencies } = useNuxtApp();

defineProps({
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
 * Game providers are not in sync with User's wallet in real time,
 * so we force a refresh of the game when a payment succeeds.
 * Note: we do not use the wallet balance as it goes down with every bet, which the provider does keep track of.
 */
const paymentListenerId = ref<number | null>(null);
const iframeKey = ref(Date.now());
onMounted(() => {
  paymentListenerId.value = $dependencies.common.asyncMessagePublisher.subscribe(
    "backend:events:payments:payment-status-updated",
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
  <GameFrameIframe :key="iframeKey" :game-identifier="gameIdentifier" :src="src" />
</template>
