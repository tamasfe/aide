<script setup lang="ts">
const { t } = useI18n();

// definePageMeta({
//   layout: "carousel",
// });

const title = t("page.games");
useHead({ title });
</script>

<template>
  <div>
    <CarouselHero class="mb-4 md:mb-6 -mx-4" />
    <GridVerticalGames
      :title="title"
      :show-back-button="true"
    />
  </div>
</template>
