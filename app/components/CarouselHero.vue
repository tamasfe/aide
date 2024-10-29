<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<template>
  <div class="giro__container-full-width md:px-[var(--giro-container-padding)]">
    <BaseCarousel
      :side-controls="!isMobile"
      class="w-full"
      ratio="3/1"
    >
      <SlideAviator />
      <SlideFortuneRabbit />
      <SlideJetX />
      <SlideFortuneTiger />
      <SlideWin10K />
      <SlideChooseGiroBet />
    </BaseCarousel>
  </div>
</template>
