<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t("page.dashboard_settings"),
});
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <DashboardSettingsVerificationIdentity />
  </NuxtLayout>
</template>
