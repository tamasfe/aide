<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  middleware: ["authenticated"],
});

useHead({
  title: t("page.account_settings"),
});
</script>

<template>
  <DashboardSettingsVerificationIdentity />
</template>
