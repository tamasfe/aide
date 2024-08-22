<script setup lang="ts">
import { BaseCarousel } from "#components";

const { isMobile } = useDevice();
</script>

<template>
  <BaseCarousel
    :side-controls="!isMobile"
    class="w-full"
  >
    <SlideAviator />
    <SlideAviator />
  </BaseCarousel>
</template>
