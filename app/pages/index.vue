<script setup lang="ts">
const { $dependencies } = useNuxtApp();

const { data: categories } = await useAsyncData("home-category-identifiers", async () => {
  return $dependencies.games.ui.searchGameCategoriesByGroup.handle("home");
});
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <SearchPopover />

      <WinningNow />

      <GridHorizontalGames
        v-for="category in categories"
        :key="category.identifier"
        :category-identifier="category.identifier"
      />

      <GridHorizontalProviders />
    </div>
  </NuxtLayout>
</template>
