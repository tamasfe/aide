<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.providers"),
});
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="max-w-screen-xl mx-auto w-full px-4 giro__sections">
      <GridVerticalProviders />
    </div>
  </NuxtLayout>
</template>
