<script setup lang="ts">
import { BaseCarousel } from "#components";

const { isMobile } = useDevice();
</script>

<template>
  <BaseCarousel
    :side-controls="!isMobile"
    class="w-full"
    ratio="3/1"
  >
    <SlideAviator />
    <SlideFortuneTiger />
    <SlideRoleta />
    <SlideMines />
    <SlideWin10K />
    <SlideChooseGiroBet />
  </BaseCarousel>
</template>
