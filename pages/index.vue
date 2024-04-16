<template>
  <div class="flex flex-col items-center w-full min-h-screen">
    <div class="w-full max-w-[1296px]">
      <div class="w-full xl:px-[32px] xl:pt-4">
        <SlidersHeroSectionSlider :slides="slides" />
      </div>
      <div class="mt-8 px-4 md:px-[32px]">
        <GlobalSearchBar v-model="search" />
      </div>
      <div class="flex flex-wrap mt-[22px] gap-x-4 gap-y-4 px-4 md:px-[32px]">
        <PartialsTextChip v-for="chip in chips" :icon="chip.icon" :label="chip.label" />
      </div>
      <div class="mt-8 xl:px-[32px]">
        <SlidersCategorySlider v-for="category in categories.slice(0, 2)" :slides="category.slides" :title="category.title" />
      </div>
    </div>
    <div class="mt-8 w-full p-[42px] min-h-[182px] bg-[#232630]">

    </div>
    <div class="w-full max-w-[1296px]">
      <div class="mt-8 xl:px-[32px]">
        <SlidersCategorySlider v-for="category in categories.slice(2, categories.length)" :slides="category.slides" :title="category.title" />
      </div>
    </div>
    <div class="w-full mt-8 py-10 flex justify-center bg-[#232630]">
      <SlidersProvidersSlider :slides="providers" />
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const store = useTriggersStore();

useHead({
  bodyAttrs: {
    class: [store.getStopScroll ? 'stop-scrolling' : ''],
  },
});

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

<style scoped>
.stop-scrolling {
  height: 100%;
  overflow: hidden;
}
</style>