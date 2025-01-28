<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.support"),
});
</script>

<template>
  <AppPage :title="$t('page.support')">
    <p>content</p>
  </AppPage>
</template>
