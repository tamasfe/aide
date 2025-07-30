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
 * Optimistic loading spinner for snappier UX
 */
const loading = ref(true);
onBeforeMount(() => {
  const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
  if (iframe) {
    const MILLISECONDS_TO_STOP_SPINNER = 3000;
    setTimeout(() => {
      if (loading.value) {
        console.warn("Game iframe loading took too long, setting loading to false in case we lost the event");
        loading.value = false;
      }
    }, MILLISECONDS_TO_STOP_SPINNER);
  }
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
  <div class="w-full h-full">
    <BaseSpinner
      v-if="loading"
      class="text-subtle absolute inset-0 mx-auto my-auto"
      :size="26"
    />
    <iframe
      id="game-iframe"
      :key="iframeKey"
      :src="iFrameUrl"
      loading="eager"
      width="100%"
      height="100%"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      class="block border-0"
      @load="loading = false"
    />
  </div>
</template>
