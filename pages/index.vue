<template>
  <div class="w-full min-h-screen">
    <div class="w-full flex justify-center pt-4">
      <HeroSectionSlider :slides="slides"/>
    </div>
  </div>
</template>

<script setup>
import HeroSectionSlider from '~/components/HeroSectionSlider.vue';

const { locale } = useI18n();

const slides = [
  {
    imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
    link: "/"
  },
  {
    imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
    link: "/"
  },
  {
    imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
    link: "/"
  },
]
</script>
