<script setup lang="ts">
const { t } = useI18n();

const title = t("page.games");
useHead({ title });
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="max-w-screen-xl mx-auto w-full px-4 giro__sections">
      <GridVerticalGames
        :title="title"
        :category-identifier="null"
        :provider-identifier="null"
        :show-back-button="true"
      />
    </div>
  </NuxtLayout>
</template>
