<script setup lang="ts">
const { params } = useRoute();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const categoryIdentifier = params.id;
if (!categoryIdentifier || typeof categoryIdentifier !== "string") {
  $dependencies.common.logger.error("Id paramater in category page is not a string. It should be the Category identifier", { categoryIdentifier });
  await navigateTo("/");
}
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridVerticalGames :title="t(`category.${categoryIdentifier}`)" :category-identifier="String(categoryIdentifier)" :provider-id="null" />
    </div>
  </NuxtLayout>
</template>
