<script setup lang="ts">
// DESIGN STATUS           ✅
// ARCHITECTURE STATUS:    ✴️
//   * we might need to check how softswiss handles multiple languages for the description

// NOTE the entire bottom section might not come from the game API but would be a custom description we add ourself for the most popular games
</script>

<template>
  <div class="p-3 pb-4 md:p-4 lg:p-6 gap-4 md:gap-6 flex flex-row rounded-default">
    <div class="hidden sm:block min-w-[8rem]">
      <ImageRatio
        src="/assets/images/games/3.png"
        class="rounded-default"
      />
    </div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex flex-row gap-4">
        <ImageRatio
          src="/assets/images/games/3.png"
          class="sm:hidden w-[3rem] rounded-default"
        />
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold">Potion Spells</h2>
          <div class="flex items-center space-x-2">
            <BaseButton
              v-for="name in ['Cards', 'Casino', 'Slots']"
              :key="name"
              variant="secondary"
              size="ghost"
              class="rounded-default px-2 py-0.5"
            >
              {{ name }}
            </BaseButton>
          </div>
        </div>
      </div>
      <p class="text-subtle">Wild Spirit Slots is an engaging online slot game that transports players into the mystical world of Native American folklore. With its stunning graphics and immersive sound effects, the game features symbols inspired by tribal culture, including totems, eagles, horses, and brave warriors. Players can enjoy a variety of exciting features such as free spins, multipliers, and a bonus round that enhances the gameplay experience. The game's intuitive interface and captivating theme make it a favorite among slot enthusiasts seeking both adventure and substantial rewards. Spin the reels of Wild Spirit Slots and embark on a journey of spiritual discovery and big wins.</p>
    </div>
  </div>
</template>
