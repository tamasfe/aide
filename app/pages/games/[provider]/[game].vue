<script setup lang="ts">
import { constructGameIdentifier } from "~/modules/games/domain/Game";

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

const { params } = useRoute();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const { isMobile } = useDevice();

const currentDevice = isMobile ? "mobile" : "desktop";

const providerSlug = params.provider;
const gameSlug = params.game;
if (!providerSlug || !gameSlug || typeof providerSlug !== "string" || typeof gameSlug !== "string") {
  $dependencies.common.logger.warn("Game slug route parameter is missing", { providerSlug, gameSlug });
  await navigateTo("/");
  throw new Error("Game slug route parameter is missing");
}

const gameIdentifier = constructGameIdentifier(providerSlug, gameSlug);

useHead({
  title: t("page.game", { game: toSentenceCase(gameIdentifier) }),
});

const queryGameCategories = async () => $dependencies.games.ui.searchGameCategoriesByGroup.handle("game_page", false);
</script>

<template>
  <div>
    <GameFrameWrapper :game-identifier="gameIdentifier" />
    <UseAsyncData v-if="currentDevice === 'desktop'" id="game-page-categories" :fetch-items="queryGameCategories">
      <template #default="{ items }">
        <GridHorizontalGames
          v-for="category in items"
          :key="category.identifier"
          :category-identifier="category.identifier"
          :initial-games="category.games || undefined"
        />
      </template>
    </UseAsyncData>
  </div>
</template>
