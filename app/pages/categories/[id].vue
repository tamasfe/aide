<script setup lang="ts">
const { params } = useRoute();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const categoryIdentifier = params.id;
if (!categoryIdentifier || typeof categoryIdentifier !== "string") {
  $dependencies.common.logger.warn("Id paramater in category page is not a string. It should be the Category identifier", { categoryIdentifier });
  await navigateTo("/");
}

const categoryTitle = t(`category.${categoryIdentifier}`);
useHead({
  title: t("page.category", { category: categoryTitle }),
});
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridVerticalGames
        :title="categoryTitle"
        :category-identifier="String(categoryIdentifier)"
        :provider-id="null"
        :show-back-button="true"
      />
    </div>
  </NuxtLayout>
</template>
