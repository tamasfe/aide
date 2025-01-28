<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.faq"),
});
</script>

<template>
  <AppPage :title="$t('page.faq')">
    <p>content</p>
  </AppPage>
</template>
