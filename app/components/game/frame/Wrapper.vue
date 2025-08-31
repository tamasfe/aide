<script setup lang="ts">
import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";

const { isMobile } = useDevice();
const currentDevice = isMobile ? "mobile" : "desktop";
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const fullscreen = ref(false);

const userStore = useUserStore();
const authenticated = computed(() => {
  return userStore.isAuthenticated;
});

const props = defineProps<{
  gameIdentifier: string;
}>();

const ENABLE_SERVER_SIDE_RENDERING_FOR_GAME = true;
const DEFER_CLIENT_SIDE_LOADING_FOR_GAME = true;

const { data: game, status: statusLoadingGame } = await useAsyncData(`game-${props.gameIdentifier}`, async () => {
  return $dependencies.games.ui.findGameCompatibilityByIdentifierOnGamePage.handle(props.gameIdentifier, currentDevice);
}, { lazy: DEFER_CLIENT_SIDE_LOADING_FOR_GAME, server: ENABLE_SERVER_SIDE_RENDERING_FOR_GAME });

const { data: iframeUrl } = await useAsyncData(`game-frame-url-${props.gameIdentifier}`, async () => {
  if (!walletStore.wallet && authenticated.value) {
    await $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: "deposit" });
  }

  return $dependencies.games.ui.buildGameSessionIFrameUrl.handle(props.gameIdentifier, currentDevice, walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
}, {
  lazy: DEFER_CLIENT_SIDE_LOADING_FOR_GAME,
  server: ENABLE_SERVER_SIDE_RENDERING_FOR_GAME,
  watch: [() => game.value, () => walletStore.wallet, () => authenticated.value],
});

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
        :fullscreen="fullscreen"
        :authenticated="authenticated ?? false"
        :iframe-url="iframeUrl || ''"
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
        :authenticated="authenticated ?? false"
        :iframe-url="iframeUrl"
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
