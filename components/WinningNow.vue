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
      <WinningNowGame
        v-for="id in 10"
        :key="id"
        class="min-w-[90%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[20%]"
      />
    </div>
  </div>
</template>
