<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("page.affiliate_program"),
});
</script>

<template>
  <AppPage :title="$t('page.affiliate_program')">
    <p>content</p>
  </AppPage>
</template>
