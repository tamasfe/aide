<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { $dependencies } = useNuxtApp();
const { isMobile } = useDevice();
const walletStore = useWalletStore();
const userStore = useUserStore();
const i18n = useI18n();

const currentDevice = isMobile ? "mobile" : "desktop";

const gameIdentifier = useGameIdentifier();

const { data: game } = await useAsyncData(
  computed(() => `game-${gameIdentifier.value}`),
  async () => {
    return $dependencies.games.ui.findGameCompatibilityByIdentifierOnGamePage.handle(gameIdentifier.value, currentDevice);
  }, {
    server: true,
    lazy: true,
  });

const emit = defineEmits<{
  (e: "close"): void;
}>();

// We have to disable server-side rendering for the game, as we rely on our cloudflare proxy to route these requests
// to our main-instance in ireland. If we enable SSR, the request will be made to the API instance within the same region, which means
// in the case of a secondary region, the request will be sent against the API in that region, which then has to send mutating
// queries to the main DB in the primary region leading to major slowdowns due to high SQL query RTT (round trip time).
// If we want to allow SSR session inititalization, we have to first find a solution for redirecting these requests to the main region internally.

const { data: gameSession } = useAsyncData(
  computed(() => `game-${gameIdentifier.value}-session`),
  async () => {
    return $dependencies.games.ui.createGameSessionFromGamePage.handle(
      gameIdentifier.value,
      userStore.user?.id,
      walletStore.wallet?.currency,
      currentDevice,
    );
  },
  {
    watch: [gameIdentifier, () => userStore.user?.id, () => walletStore.wallet?.currency],
    server: false,
  });

// We can enable server side rendering for the demo session, as no user specific data is required.
// and thus the demo session can usually be generated on the edge.

const { data: gameDemoSession } = useAsyncData(
  computed(() => `game-${gameIdentifier.value}-demo-session`),
  async () => {
    if (!game.value?.demo) {
      return null;
    }

    return $dependencies.games.ui.createGameSessionDemoFromGamePage.handle(gameIdentifier.value, i18n.localeProperties.value.language || i18n.locale.value.split("-")[0] || "", currentDevice);
  },
  {
    watch: [game, i18n.localeProperties],
    server: true,
  });
</script>

<template>
  <NuxtPage
    :game="game"
    :game-session="gameSession"
    :game-demo-session="gameDemoSession"
    @close="emit('close')"
  />
</template>
