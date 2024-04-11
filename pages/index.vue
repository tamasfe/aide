<template>
  <div class="flex flex-col items-center w-full min-h-screen">
    <div class="w-full max-w-[1296px] px-[32px]">
      <div class="w-full flex justify-center pt-4">
        <HeroSectionSlider :slides="slides"/>
      </div>
      <div class="mt-8">
        <GlobalSearchBar v-model="search"/>
      </div>
      <div class="flex mt-[22px] gap-x-4">
        <PartialsTextChip v-for="chip in chips" :icon="chip.icon" :label="chip.label" />
      </div>
    </div>
  </div>
</template>

<script setup>
import HeroSectionSlider from '~/components/HeroSectionSlider.vue';

const { locale } = useI18n();

let search = ref('')

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

const chips = [
  {
    icon: 'https://placehold.co/14',
    label: 'Aviator'
  },
  {
    icon: 'https://placehold.co/14',
    label: 'Mines'
  },
  {
    icon: 'https://placehold.co/14',
    label: 'Fortune'
  },
  {
    icon: 'https://placehold.co/14',
    label: 'Casino'
  },
  {
    icon: 'https://placehold.co/14',
    label: 'Casino (Live)'
  }
]
</script>
