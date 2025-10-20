<script setup lang="ts">
const { params } = useRoute();
const { t } = useI18n();
const logger = useLogger();

definePageMeta({
  layout: "carousel",
});

const categoryIdentifier = params.identifier;
if (!categoryIdentifier || typeof categoryIdentifier !== "string") {
  logger.warn("Id paramater in category page is not a string. It should be the Category identifier", { categoryIdentifier });
  await navigateTo("/");
}

const categoryTitle = t(`category.${categoryIdentifier}`);
useHead({
  title: t("page.category", { category: categoryTitle }),
});
</script>

<template>
  <GridVerticalGames
    :title="categoryTitle"
    :category-identifier="String(categoryIdentifier)"
    :show-back-button="true"
  />
</template>
