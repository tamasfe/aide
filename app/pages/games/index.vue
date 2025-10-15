<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "carousel",
});

const title = t("page.games");
useHead({ title });
</script>

<template>
  <GridVerticalGames
    :title="title"
    :category-identifier="null"
    :provider-identifier="null"
    :show-back-button="true"
  />
</template>
