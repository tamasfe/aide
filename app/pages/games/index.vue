<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  layout: "carousel",
});

const title = t("page.games");
useHead({ title });
</script>

<template>
  <div>
    <GridVerticalGames
      :title="title"
      :show-back-button="true"
    />
  </div>
</template>
