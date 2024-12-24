<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * there are some edge cases we should handle, like what happens when you run out of money (how to display it to the user, etc)
//   * for performance reasons we CANT be duplicating some heavy iframe around however which loads tons of assets (ie multiple hidden ones)
//   * this also needs to hide the balance in menu bar (see me for details, we will do it how bet7k does)
//   * look at how Blaze + Bet7k transition between the mobile and desktop frames
//     based on an exact breakpoint. note that it MUST have more logic than just responsive
//     because there can only ever be 1 game frame at once. the way these sites handle it
//     looks to be having a v-if which unloads the frame. this is horrible as if you make
//     your browser small, all your progress is lost. so we have 3 ways...
//   * 1) (current approach) Load desktop or mobile to start, and dont handle that device changing screen. separate out into components
//   * 2) switch between them but MOVE the iframe so you dont lose your place. i have no idea the nuance of this
//   * 3) make it truly responsive and handle ALL cases... probably quite complicated and CSS spaghetti
//
//   Personally approach 1 seems perfectly fine now as i dont want edge cases with moving iframes in old browsers etc.
// TRANSLATION STATUS:  ✅

const { isMobile } = useDevice();
const currentDevice = isMobile ? "mobile" : "desktop";
const { params } = useRoute();
const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();

const gameId = Number(params.id);
if (!params.id || Number.isNaN(gameId)) {
  $dependencies.common.logger.warn("Game ID route parameter should be a number", { gameId });
  await navigateTo("/");
}

const ENABLE_SERVER_SIDE_RENDERING_FOR_GAME = true;
const DEFER_CLIENT_SIDE_LOADING_FOR_GAME = true;
const { data: game, status: statusLoadingGame } = await useAsyncData(`game-${params.id}`, async () => {
  return $dependencies.games.ui.findGameCompatibilityByIdOnGamePage.handle(gameId, currentDevice);
}, { lazy: DEFER_CLIENT_SIDE_LOADING_FOR_GAME, server: ENABLE_SERVER_SIDE_RENDERING_FOR_GAME });
if (!game.value && statusLoadingGame.value === "success") {
  await navigateTo("/");
}

const ENABLE_SERVER_SIDE_RENDERING_FOR_CATEGORIES = false;
const DEFER_CLIENT_SIDE_LOADING_FOR_CATEGORIES = true;
const { data: pageCategories } = await useAsyncData(`game-${params.id}-categories`, async () => {
  return $dependencies.games.ui.searchGameCategoriesByGroup.handle("game_page", false);
}, { lazy: DEFER_CLIENT_SIDE_LOADING_FOR_CATEGORIES, server: ENABLE_SERVER_SIDE_RENDERING_FOR_CATEGORIES });

const iFrameUrl = computed(() => {
  if (walletStore.isInit) {
    return $dependencies.games.ui.buildGameSessionIFrameUrl.handle(gameId, currentDevice, walletStore.wallet.currency);
  }
  return "";
});
</script>

<template>
  <div v-if="currentDevice === 'mobile'">
    <div v-if="game">
      <GameFrameMobile
        v-if="game.isCompatibleWithDevice"
        :game-title="game.name"
        :game-id="game.id"
        :game-image-url="game.imageUrl"
        :authenticated="walletStore.isInit === true"
        :i-frame-url="iFrameUrl"
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
  </div>

  <div
    v-else-if="currentDevice === 'desktop'"
    class="pt-4 pb-12 giro__container giro__sections"
  >
    <div v-if="game">
      <GameFrameDesktop
        v-if="!isMobile && game.isCompatibleWithDevice"
        :game-title="game.name"
        :game-id="game.id"
        :game-image-url="game.imageUrl"
        :authenticated="walletStore.isInit === true"
        :i-frame-url="iFrameUrl"
      />
      <GameFloatTextNotSupportedOnDevice
        v-else-if="!isMobile && !game.isCompatibleWithDevice"
        class="px-6 h-96"
        :current-device="currentDevice"
      />

      <GameDescription
        :id="gameId"
        :image-url="game.imageUrl"
        class="bg-subtle"
        :description="game.description"
        :title="game.name"
        :categories="['card', 'table', 'poker']"
      />
    </div>
    <div v-else class="h-[60vh] w-full">
      <BaseSkeleton class="w-full h-full" :loading="true" />
    </div>

    <GridHorizontalGames
      v-for="category in pageCategories"
      :key="category.identifier"
      :category-identifier="category.identifier"
    />
  </div>
</template>
