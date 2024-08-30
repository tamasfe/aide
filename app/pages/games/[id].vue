<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * the [full screen] button needs to load a similar iframe as mobile, maybe the same?
//   * for performance reasons we CANT be duplicating some heavy iframe around however which loads tons of assets (ie multiple hidden ones)
//   * this also needs to hide the deposit in menu bar (see me for details, we will do it how bet7k does)
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
</script>

<template>
  <div class="pt-4 pb-12 giro__container giro__sections">
    <GameFrameMobile v-if="true" />
    <GameFrameDesktop v-else />

    <GameDescription
      class="bg-subtle"
    />

    <WrapperScrollerGame />
    <WrapperScrollerGame />
  </div>
</template>
