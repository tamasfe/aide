<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const siteStore = useSiteStore();

useHead({
  title: t("page.home", { siteName: siteStore.name }),
});

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

      <GridHorizontalGames
        v-for="category in categories"
        :key="category.identifier"
        :category-identifier="category.identifier"
        :initial-games="category.games ?? undefined"
      />

      <GridHorizontalProviders />
    </div>
  </NuxtLayout>
</template>
