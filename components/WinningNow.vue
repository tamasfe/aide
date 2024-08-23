<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * not done
//   * refactor this css to be a lot better
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done

const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-4">
    <h3 class="sm:text-xl font-bold">🏆 {{ t("winning_now.title") }}</h3>
    <div
      class="no-scrollbar flex-1 flex items-center gap-2 overflow-x-auto"
    >
      <NuxtLink
        v-for="id in 10"
        :key="id"
        to="/game/123"
        class="min-w-[90%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[20%] flex flex-row items-center space-x-3 bg-subtle p-2 rounded-lg cursor-pointer outline-none"
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
    </div>
  </div>
</template>
