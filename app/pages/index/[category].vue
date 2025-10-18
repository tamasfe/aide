<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const { params } = useRoute();
const logger = useLogger();

definePageMeta({
  layout: "carousel",
  scrollToTop: false,
});

const categoryIdentifier = params.category;
if (!categoryIdentifier || typeof categoryIdentifier !== "string") {
  logger.warn("Id paramater in category page is not a string. It should be the Category identifier", { categoryIdentifier });
  await navigateTo("/");
}

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const categoryTitle = t(`category.${categoryIdentifier}`);
</script>

<template>
  <GridVerticalGames
    :title="categoryTitle"
    :category-identifier="String(categoryIdentifier)"
    :provider-identifier="null"
  />
</template>
