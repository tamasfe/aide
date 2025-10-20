<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const { params } = useRoute();

definePageMeta({
  layout: "carousel",
  scrollToTop: false,
  middleware: [(to) => {
    if (!to.params.category) {
      const localePath = useLocalePath();

      return localePath("/");
    }
  }],
});

const categoryIdentifier = params.category;

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const categoryTitle = t(`category.${categoryIdentifier}`);
</script>

<template>
  <div>
    <GridVerticalGames
      :title="categoryTitle"
      :category-identifier="String(categoryIdentifier)"
    />
  </div>
</template>
