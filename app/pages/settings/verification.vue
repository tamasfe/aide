<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t("page.account_settings"),
});
</script>

<template>
  <DashboardSettingsVerificationIdentity />
</template>
