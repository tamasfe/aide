<script setup lang="ts">
const { t } = useI18n();

const title = t("page.games");
useHead({ title });
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridVerticalGames
        :title="title"
        :category-identifier="null"
        :provider-id="null"
        :show-back-button="true"
      />
    </div>
  </NuxtLayout>
</template>
