<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";

console.log("test");
</script>

<template>
  <div class="p-8 flex gap-x-8 rounded-default">
    <div class="min-w-56 hidden md:block">
      <div class="relative rounded-default overflow-hidden pt-[134.26%]">
        <NuxtImg
          src="https://picsum.photos/200/300"
          alt=""
          class="absolute top-0 left-0 w-full h-full rounded-default"
        />
      </div>
    </div>
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-2">
        <h2 class="text-[1.7rem] sm:text-xl font-bold leading-3">
          Potion Spells
        </h2>
        <p class="text-xl text-subtle-light font-semibold block sm:hidden">
          By Pragmatic Play
        </p>
        <div class="flex items-center space-x-2">
          <button
            v-for="name in ['Cards', 'Casino', 'Slots']"
            :key="name"
            type="button"
            class="bg-emphasis outline-none rounded-default text-subtle text-lg sm:text-base font-medium px-2 py-0.5"
          >
            {{ name }}
          </button>
        </div>
      </div>
      <p class="text-subtle">
        Wild Spirit Slots is an engaging online slot game that transports
        players into the mystical world of Native American folklore. With its
        stunning graphics and immersive sound effects, the game features symbols
        inspired by tribal culture, including totems, eagles, horses, and brave
        warriors. Players can enjoy a variety of exciting features such as free
        spins, multipliers, and a bonus round that enhances the gameplay
        experience. The game's intuitive interface and captivating theme make it
        a favorite among slot enthusiasts seeking both adventure and substantial
        rewards. Spin the reels of Wild Spirit Slots and embark on a journey of
        spiritual discovery and big wins.
      </p>

      <BaseButton
        class="bg-emphasis text-subtle hover:text-emphasis w-max !text-base !font-medium !px-4 !py-2 xl:!px-5 xl:!py-2.5 !rounded-md"
        big
      >
        <div class="inline-flex items-center gap-x-2">
          <p>Show more</p>
          <div>
            <PhCaretDown :size="20" />
          </div>
        </div>
      </BaseButton>
    </div>
  </div>
</template>
