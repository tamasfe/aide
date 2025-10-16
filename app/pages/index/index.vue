<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const { $dependencies } = useNuxtApp();

definePageMeta({
  layout: "carousel",
});

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const { data: gameCategories, pending } = useAsyncData("home-page-game-categories",
  async () => $dependencies.games.ui.searchGameCategoriesByGroup.handle("home", true),
  {
    server: true,
    lazy: true,
    default: () => [],
  },
);
</script>

<template>
  <div>
    <template v-if="pending">
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
      <GridHorizontalGamesLoading class="mb-6 -md-4" />
    </template>

    <template v-else>
      <GridHorizontalGames
        v-for="category in gameCategories?.filter(cat => cat.games && cat.games.length > 0)"
        :key="category.identifier"
        class="mb-6 -mx-4"
        :category-identifier="category.identifier"
        :initial-games="category.games ?? undefined"
      />
    </template>

    <GridHorizontalProviders class="mb-6" />
  </div>
</template>
