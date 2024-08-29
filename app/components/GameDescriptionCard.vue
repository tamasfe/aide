<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";
</script>

<template>
  <div class="p-6 flex gap-x-8 rounded-default">
    <div class="min-w-[12.8rem] hidden md:block">
      <ImageRatio
        src="/assets/images/games/3.png"
        class="rounded-default"
      />
    </div>
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-2">
        <h2 class="text-2xl sm:text-xl font-bold leading-3">Potion Spells</h2>
        <p class="text-lg text-subtle-light font-semibold block sm:hidden">
          Pragmatic Play
        </p>
        <div class="flex items-center space-x-2">
          <button
            v-for="name in ['Cards', 'Casino', 'Slots']"
            :key="name"
            type="button"
            class="bg-emphasis outline-none rounded-default text-subtle font-medium px-2 py-0.5"
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
        class="bg-emphasis text-subtle hover:text-emphasis w-max !text-base !font-medium !px-3 !py-2 xl:!px-4 xl:!py-2.5 rounded-lg"
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
