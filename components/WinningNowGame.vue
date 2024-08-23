<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * not done
//   * refactor this css to be a lot better
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done
</script>

<template>
  <NuxtLink
    to="/game/123"
    class="flex flex-row items-center space-x-3 bg-subtle p-2 rounded-lg cursor-pointer outline-none"
  >
    <div class="flex-shrink-0 rounded-[0.7rem]">
      <NuxtImg
        src="/assets/images/games/2.png"
        alt=""
        class="aspect-[300/350] w-full h-auto object-cover object-center rounded-default"
      />
    </div>
    <div class="font-medium leading-tight space-y-1">
      <div class="font-semibold">Rui***</div>
      <div class="text-subtle text-sm">Golden rush inferno</div>
      <div class="text-lg bg-button-primary text-transparent bg-clip-text">R$ 32.14</div>
    </div>
  </NuxtLink>
</template>
