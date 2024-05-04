<template>
  <div class="flex flex-col items-center w-full min-h-screen">
    <div class="w-full max-w-[1296px]">
      <div class="w-full xl:px-8 xl:pt-4">
        <SlidersHeroSectionSlider :slides="slides" />
      </div>
      <div class="mt-8 px-4 lg:px-8">
        <GlobalSearchBar v-model="search" />
      </div>
      <div class="w-full relative">
        <div class="md:flex md:flex-wrap w-full h-9 mt-[22px] gap-x-4 gap-y-4 pl-4 lg:pl-8 pr-0 md:pr-8 overflow-y-hidden overflow-x-scroll md:overflow-y-visible md:overflow-x-visible whitespace-nowrap md:whitespace-normal scroll-smooth snap-x snap-mandatory applyScrollbarHide">
          <PartialsTextChip
            class="inline-block snap-start first:pl-4 md:first:pl-0 mr-3 md:mr-0 select-none"
            v-for="chip in chips"
            :icon="chip.icon"
            :label="chip.label"
          />
        </div>
        <div class="absolute block md:hidden w-8 right-0 top-0 h-full bg-gradient-to-r from-transparent to-body-bg"></div>
      </div>
      
      <div class="mt-8 xl:px-8">
        <SlidersCategorySlider
          v-for="category in categories.slice(0, 2)"
          :slides="category.slides"
          :title="category.title"
        />
      </div>
    </div>
    <div class="mt-8 w-full p-[42px] min-h-[182px] bg-body-secondary-bg" />
    <div class="w-full max-w-[1296px]">
      <div class="mt-8 xl:px-8">
        <SlidersCategorySlider
          v-for="category in categories.slice(2, categories.length)"
          :slides="category.slides"
          :title="category.title"
        />
      </div>
    </div>
    <div class="w-full mt-8 py-10 flex justify-center bg-body-secondary-bg">
      <SlidersProvidersSlider :slides="providers" />
    </div>
  </div>
</template>

<script setup>
// const { locale } = useI18n();

const search = ref("");

const slides = [
  {
    imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
    link: "/",
  },
  {
    imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
    link: "/",
  },
  {
    imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
    link: "/",
  },
  {
    imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
    link: "/",
  },
  {
    imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
    link: "/",
  },
];

const categories = [
  {
    title: "👍 Top Games",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "NEW",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "NEW",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "NEW",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "💎 Trending Games",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "🥇 New Games",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "🔥 Hot Games - 24H",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "❄ Cold Games - 24H",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "🏆 Megaways",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
  {
    title: "😈 Slots",
    slides: [
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
      {
        imageUrl: "https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png",
        link: "/",
        label: "RTP: 884%",
      },
    ],
  },
];

const providers = [
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
  {
    title: "Platipus",
    gamesCount: 109,
    link: "/",
  },
];

const chips = [
  {
    icon: "🛸",
    label: "Aviator",
  },
  {
    icon: "💣",
    label: "Mines",
  },
  {
    icon: "🍀",
    label: "Fortune",
  },
  {
    icon: "🎰",
    label: "Casino",
  },
  {
    icon: "🎥",
    label: "Casino (Live)",
  },
];
</script>
