<template>
  <div class="w-full min-h-screen">
    <div class="w-full flex justify-center pt-4">
      <HeroSectionSlider />
    </div>
  </div>
</template>

<script setup>
import HeroSectionSlider from '~/components/HeroSectionSlider.vue';

const { locale } = useI18n();
</script>
