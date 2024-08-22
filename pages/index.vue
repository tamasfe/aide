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
            <!-- Search hardcoded for now, until we agree to final design -->
            <WrapperGameScroll identifier="weekly-top-picks" />
          </template>
        </BaseSearch>
        <HomeWinningNow class="w-full" />
        <WrapperGameScroll
          v-for="category in data"
          :key="category.id"
          :identifier="category.identifier"
        />
        <WrapperProviderScroll title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
