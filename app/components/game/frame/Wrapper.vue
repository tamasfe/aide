<script setup lang="ts">
const { isMobile } = useDevice();
const currentDevice = isMobile ? "mobile" : "desktop";
const { $dependencies } = useNuxtApp();
const fullscreen = ref(false);
const userStore = useUserStore();
const authenticated = computed(() => {
  return userStore.isAuthenticated;
});

const props = defineProps<{
  gameIdentifier: string;
}>();

// We have to disable server-side rendering for the game, as we rely on our cloudflare proxy to route these requests
// to our main-instance in ireland. If we enable SSR, the request will be made to the API instance within the same region, which means
// in the case of a secondary region, the request will be sent against the API in that region, which then has to send mutating
// queries to the main DB in the primary region leading to major slowdowns due to high SQL query RTT (round trip time).
// If we want to allow SSR session inititalization, we have to first find a solution for redirecting these requests to the main region internally.
const ENABLE_SERVER_SIDE_RENDERING_FOR_GAME = false;
const DEFER_CLIENT_SIDE_LOADING_FOR_GAME = true;

const { data: game, status: statusLoadingGame } = await useAsyncData(`game-${props.gameIdentifier}`, async () => {
  return $dependencies.games.ui.findGameCompatibilityByIdentifierOnGamePage.handle(props.gameIdentifier, currentDevice);
}, { lazy: DEFER_CLIENT_SIDE_LOADING_FOR_GAME, server: ENABLE_SERVER_SIDE_RENDERING_FOR_GAME });

/* Redirect if the game is successfully searched, but server returns no results (404) */
watch([() => game.value, () => statusLoadingGame.value], async ([game, statusLoadingGame]) => {
  if (game === null && statusLoadingGame === "success") {
    await navigateTo("/");
  }
});
</script>

<template>
  <template v-if="currentDevice === 'mobile'">
    <div
      v-if="game"
      class="h-full min-h-full max-h-full"
    >
      <GameFrameMobile
        v-if="
          game.isCompatibleWithDevice"
        :game-title="game.name"
        :game-identifier="game.identifier"
      />
      <GameFloatTextNotSupportedOnDevice
        v-else-if="!game.isCompatibleWithDevice"
        class="px-6 h-96"
        :current-device="currentDevice"
      />
    </div>
    <div v-else class="h-[25vh] w-full">
      <BaseSkeleton class="w-full h-full" :loading="true" />
    </div>
  </template>

  <div
    v-else-if="currentDevice === 'desktop'"
    class="pt-4 pb-12 giro__container giro__sections"
  >
    <div v-if="game" class="bg-subtle rounded border border-muted/5 overflow-hidden">
      <GameFrameDesktop
        v-if="!isMobile && game.isCompatibleWithDevice"
        :game-title="game.name"
        :game-identifier="game.identifier"
        :fullscreen="fullscreen"
      />

      <GameFloatTextNotSupportedOnDevice
        v-else-if="!isMobile && !game.isCompatibleWithDevice"
        class="px-6 h-96"
        :current-device="currentDevice"
      />

      <GameDescription
        :game="game"
        class="bg-subtle"
        :authenticated="authenticated ?? false"
        :description="game.description"
        @maximize="() => { fullscreen = true }"
      />
    </div>
    <div v-else class="h-[60vh] w-full rounded-lg border border-muted/5 overflow-hidden relative">
      <BaseSkeleton class="absolute inset-0" :loading="true" />
    </div>
  </div>
</template>
