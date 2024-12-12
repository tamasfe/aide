<script setup lang="ts">
const userSettingsStore = useUserSettingsStore();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

await useAsyncData("account-page-user-settings-store", async () => userSettingsStore.refresh(),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <DashboardSettingsAccountDetails />
    <DashboardSettingsAccountPersonalDetails />
    <DashboardSettingsAccountPaymentSettings />
    <DashboardSettingsAccountRegionalSettings />
    <DashboardSettingsAccountCloseAccount />
  </NuxtLayout>
</template>
