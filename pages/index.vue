<script setup lang="ts">
import { useGameCategories } from "~/composables/useGameCategories";

const search = ref("");

const { data: categories } = await useGameCategories("home");

const data = computed(() => {
  console.log("categories.value", categories.value);
  return categories.value || [];
});
</script>

<template>
  <div class="sm:py-8">
    <div class="max-w-full sm:px-4 xl:p-0 xl:max-w-[1240px] mx-auto">
      <CarouselHome class="w-full" />
    </div>
    <div class="giro__container py-6">
      <div class="flex flex-col gap-8">
        <BaseSearch
          v-model="search"
          class="w-full"
        >
          <template #default>
            <!-- Search hardcoded for now, until we agree to final design -->
            <WrapperGameScroll
              identifier="weekly-top-picks"
              :category="9"
            />
          </template>
        </BaseSearch>
        <HomeWinningNow class="w-full" />
        <WrapperGameScroll
          v-for="category in data"
          :key="category.id"
          :identifier="category.identifier"
          :category="category.id"
        />
        <WrapperProviderScroll title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
