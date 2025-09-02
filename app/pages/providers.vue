<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.providers"),
});
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridVerticalProviders />
    </div>
  </NuxtLayout>
</template>
