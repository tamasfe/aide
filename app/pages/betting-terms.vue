<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.betting_terms"),
});
</script>

<template>
  <AppPage :title="$t('page.betting_terms')">
    <p>content</p>
  </AppPage>
</template>
