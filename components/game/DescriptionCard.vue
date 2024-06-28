<script setup lang="ts">
console.log("test");
</script>

<template>
  <div class="p-4 md:p-6 flex gap-x-6 rounded-default">
    <div
      class="min-w-56 max-w-sm hidden lg:block bg-subtle rounded-default h-[150px] md:h-[250px] overflow-hidden"
    >
      <NuxtImg
        src="https://picsum.photos/200/300"
        alt=""
        class="w-full h-full rounded-default"
      />
    </div>
    <div class="flex flex-col space-y-6">
      <div class="flex flex-col space-y-2">
        <h2 class="text-xl font-semibold">Game Title</h2>
        <div class="flex items-center space-x-2">
          <button
            v-for="name in ['Cards', 'Casino', 'Slots']"
            :key="name"
            type="button"
            class="bg-emphasis outline-none rounded-default text-subtle text-sm px-2 py-1"
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
    </div>
  </div>
</template>
