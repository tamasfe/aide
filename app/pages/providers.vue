<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.providers"),
});
</script>

<template>
  <div>
    <CarouselHero class="mb-4 md:mb-6 -mx-4" />
    <GridVerticalProviders />
  </div>
</template>
