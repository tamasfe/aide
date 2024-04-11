<template>
  <div class="flex flex-col items-center w-full min-h-screen">
    <div class="w-full max-w-[1296px] px-[32px]">
      <div class="w-full pt-4">
        <SlidersHeroSectionSlider :slides="slides" />
      </div>
      <div class="mt-8">
        <GlobalSearchBar v-model="search" />
      </div>
      <div class="flex mt-[22px] gap-x-4">
        <PartialsTextChip v-for="chip in chips" :icon="chip.icon" :label="chip.label" />
      </div>
      <div class="mt-8">
        <SlidersCategorySlider v-for="category in categories" :slides="category.slides" :title="category.title" />
      </div>
    </div>
    <div class="w-full mt-8 py-10 flex justify-center bg-[#232630]">
      <SlidersProvidersSlider :slides="providers" />
    </div>
  </div>
</template>

<script setup>
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

const categories = [
  {
    title: '👍 Top Games',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'NEW'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'NEW'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'NEW'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '💎 Trending Games',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '🥇 New Games',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '🔥 Hot Games - 24H',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '❄ Cold Games - 24H',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '🏆 Megaways',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
  {
    title: '😈 Slots',
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/",
        label: 'RTP: 884%'
      }
    ]
  },
]

const providers = [
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
  {
    title: 'Platipus',
    gamesCount: 109,
    link: '/'
  },
]


const chips = [
  {
    icon: '🛸',
    label: 'Aviator'
  },
  {
    icon: '💣',
    label: 'Mines'
  },
  {
    icon: '🍀',
    label: 'Fortune'
  },
  {
    icon: '🎰',
    label: 'Casino'
  },
  {
    icon: '🎥',
    label: 'Casino (Live)'
  }
]
</script>
