<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-4">
    <h3 class="sm:text-xl font-bold">🏆 {{ t("winning_now") }}:</h3>
    <div
      class="flex-1 flex items-center gap-4 overflow-x-auto giro__hide-scroll"
    >
      <HomeGameWinner
        v-for="idx in 10"
        :key="idx"
        class="min-w-[90%] sm:min-w-[50%] md:min-w-[40%] lg:min-w-[20%]"
      />
    </div>
  </div>
</template>
