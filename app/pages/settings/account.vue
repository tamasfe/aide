<script setup lang="ts">
const userSettingsStore = useUserSettingsStore();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

useHead({
  title: t("page.dashboard_settings"),
});

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const userStore = useUserStore();

const { data } = await useAsyncData("account-page-user-settings-store", async () => {
  if (userSettingsStore.status === "unititialized") {
    await userSettingsStore.refresh();
  }
  return userSettingsStore.settings;
},
{ watch: [() => userSettingsStore.settings], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <DashboardSettingsAccountDetails />
    <DashboardSettingsAccountPersonalDetails />
    <DashboardSettingsAccountPaymentSettings
      :payment-config="data?.payment || null"
      :cpf="userStore.user?.cpf || null"
      :on-click-change="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'payment_pix' } })"
    />
    <DashboardSettingsAccountRegionalSettings
      :on-click-change-language="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'language' } })"
      :on-click-change-time-zone="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'time_zone' } })"
    />
    <DashboardSettingsAccountCloseAccount />
  </NuxtLayout>
</template>
