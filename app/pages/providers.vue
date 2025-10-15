<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "carousel",
});

useHead({
  title: t("page.providers"),
});
</script>

<template>
  <GridVerticalProviders />
</template>
