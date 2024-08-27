<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done
</script>

<template>
  <div class="flex items-center justify-center">
    <h3 class="min-w-[6rem] sm:min-w-[8rem] text-center flex flex-col items-center justify-center">
      <div class="mb-2 leading-none text-5xl">🏆</div>
      <div
        class="text-sm sm:text-base leading-tight bg-button-primary text-transparent bg-clip-text font-semibold"
        v-html="$t('winning_now.title', { br: '<br>' })"
      />
    </h3>
    <div class="no-scrollbar flex-1 flex items-center gap-2 overflow-x-auto">
      <NuxtLink
        v-for="id in 10"
        :key="id"
        to="TODO"
        class="min-w-[18rem] flex flex-row items-center space-x-3 bg-subtle p-2 rounded-lg cursor-pointer outline-none"
      >
        <div class="flex-shrink-0 rounded-[0.7rem]">
          <NuxtImg
            src="/assets/images/games/2.png"
            alt=""
            class="aspect-[300/350] w-full h-auto object-cover object-center rounded-default"
          />
        </div>
        <div class="font-medium leading-tight space-y-1">
          <div class="">Rui***</div>
          <div class="text-subtle text-sm">Golden rush inferno</div>
          <div class="sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">R$ 32.14</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
