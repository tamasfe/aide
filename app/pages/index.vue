<script setup lang="ts">
const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: categories } = await useAsyncData("home-category-identifiers", async () => {
  return $dependencies.games.ui.searchGameCategoriesByGroup.handle("home", true);
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <SearchPopover />

      <WinningNow />

      <ClientOnly>
        <GridHorizontalGames
          v-for="category in categories"
          :key="category.identifier"
          :category-identifier="category.identifier"
          :initial-games="category.games ?? undefined"
        />
      </ClientOnly>

      <GridHorizontalProviders />
    </div>
  </NuxtLayout>
</template>
