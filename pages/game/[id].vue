<template>
  <div class="flex flex-col items-center w-full min-h-screen">
    <div class="w-full max-w-[1296px] px-[32px]">
      <GameFrame />
    </div>

    <div class="w-full max-w-[1296px] px-[32px] mt-[62px] mb-20">
      <div class="flex place-content-between items-center mb-6">
        <h1 class="text-2xl font-montserrat text-white font-semibold">Mines</h1>
        <div class="flex gap-x-2">
          <PartialsTextChip
            :icon="'💣'"
            :label="'Mines'"
          />
          <PartialsTextChip
            :icon="'💣'"
            :label="'Mines'"
          />
        </div>
      </div>
      <div class="flex gap-x-8 flex-col md:flex-row">
        <div class="md:max-w-[161px]">
          <img
            src="~/assets/images/placeholders/placeholder-game.png"
            class="w-full mb-4 md:mb-0"
          >
        </div>
        <div class="flex-1 p-6 md:p-8 rounded-xl bg-body-secondary-bg">
          <p class="text-white font-montserrat mb-8">
            Get ready to enjoy the most thrilling adaptation of one of the classic games in history with Mines! Explore the minefield and search for diamonds while avoiding dangerous explosives. Here, you'll discover your mining skills with various difficulty levels - an ideal experience for both beginners and those interested in higher risk!
            Do you have what it takes to find valuable treasures? Play Mines on GiroBet and find out!
          </p>

          <h2 class="text-2xl font-montserrat text-white font-semibold mb-7">About Mines</h2>

          <div class="flex flex-col mb-8">
            <p
              v-for="item in 5"
              class="inline-flex border-b-[2px] border-b-game-title-border p-5"
            >
              <span class="text-white font-montserrat font-semibold text-opacity-60 basis-1/2">
                Game
              </span>
              <span class="text-white font-montserrat basis-1/2">
                Mines
              </span>
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-montserrat text-white font-semibold mb-4">How To Play Mines</h2>

            <p class="text-white font-montserrat mb-4">
              Get ready to enjoy the most thrilling adaptation of one of the classic games in history with Mines! Explore the minefield and search for diamonds while avoiding dangerous explosives. Here, you'll discover your mining skills with various difficulty levels - an ideal experience for both beginners and those interested in higher risk!
              Do you have what it takes to find valuable treasures? Play Mines on GiroBet and find out!
            </p>

            <ul class="text-white font-montserrat list-decimal pl-10">
              <li>Get ready to enjoy the most thrilling adaptation of one of the classic games in history with Mines! Explore the minefield and search for diamonds while avoiding dangerous explosives. Here, you'll discover your mining skills with various difficulty levels - an ideal experience for both beginners and those interested in higher risk!</li>
              <li>Do you have what it takes to find valuable treasures? Play Mines on GiroBet and find out!</li>
            </ul>
          </div>

          <div class="flex justify-start" />
        </div>
      </div>
    </div>

    <div class="w-full max-w-[1296px]">
      <div class="mt-8 xl:px-[32px]">
        <SlidersCategorySlider
          v-for="category in categories"
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

<script setup lang="ts">
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
];
</script>
