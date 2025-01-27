<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<template>
  <BaseCarousel
    :side-controls="!isMobile"
    class="w-full md:rounded-lg overflow-hidden"
    ratio="3/1"
  >
    <div class="px-4 md:px-0 grid grid-cols-3 gap-x-2 md:gap-x-4">
      <SlideAviator class="rounded-sm md:rounded-lg overflow-auto" />
      <SlideFortuneRabbit class="rounded-sm md:rounded-lg overflow-auto" />
      <SlideJetX class="rounded-sm md:rounded-lg overflow-auto" />
    </div>

    <SlideFortuneTiger />
    <SlideWin10K />
    <SlideChooseGiroBet />
  </BaseCarousel>
</template>
