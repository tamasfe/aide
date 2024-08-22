<script setup lang="ts">
const search = ref("");
const data = ref([]);
</script>

<template>
  <div class="sm:py-8">
    <div class="max-w-full sm:px-4 xl:p-0 xl:max-w-[1240px] mx-auto">
      <CarouselHero />
    </div>
    <div class="giro__container py-6">
      <div class="flex flex-col gap-8">
        <BaseSearch
          v-model="search"
          class="w-full"
        >
          <template #default>
            <WrapperScrollerGame />
          </template>
        </BaseSearch>

        <BaseWinningNow />

        <WrapperScrollerGame
          v-for="category in data"
          :key="category.id"
          :identifier="category.identifier"
        />

        <WrapperScrollerProvider title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
