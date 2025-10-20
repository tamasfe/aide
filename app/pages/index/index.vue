<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const games = useGameModule();

definePageMeta({
  layout: "carousel",
  scrollToTop: false,
});

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const { data: gameCategories } = useAsyncData(
  async () => games.ui.searchGameCategoriesByGroup.handle("home", true),
  {
    server: true,
    lazy: true,
    transform: data => data.filter(category => category.games && category.games.length > 0),
  },
);
</script>

<template>
  <div>
    <template v-if="!gameCategories">
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
    </template>

    <template v-else>
      <GridHorizontalGames
        v-for="category in gameCategories"
        :key="category.identifier"
        class="mb-6 -mx-4"
        :category-identifier="category.identifier"
        :initial-games="category.games ?? undefined"
      />
    </template>

    <GridHorizontalProviders class="mb-6" />
  </div>
</template>
