<script setup lang="ts">
import { BaseCarousel } from "#components";

const { isMobile } = useDevice();
</script>

<template>
  <BaseCarousel
    :side-controls="!isMobile"
    bottom-controls
  >
    <SlideTry />
    <div>Component 2</div>
    <div>Component 3</div>
  </BaseCarousel>
</template>
