<script setup lang="ts">
const userSettingsStore = useUserSettingsStore();
const userModule = useUserModule();
const { t } = useI18n();

useHead({
  title: t("page.account_settings"),
});

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const userStore = useUserStore();

const { data } = useAsyncData("account-page-user-settings-store", async () => {
  if (userSettingsStore.status === "unititialized") {
    await userSettingsStore.refresh();
  }
  return userSettingsStore.settings;
},
{ watch: [() => userSettingsStore.settings], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <div>
    <DashboardSettingsAccountDetails class="mb-4" />
    <DashboardSettingsAccountPersonalDetails class="mb-4" />
    <DashboardSettingsAccountPaymentSettings
      class="mb-4"
      :payment-config="data?.payment || null"
      :cpf="userStore.user?.cpf || null"
      :on-click-change="() => userModule.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'payment_pix' } })"
    />
    <DashboardSettingsAccountRegionalSettings
      class="mb-4"
      :on-click-change-language="() => userModule.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'language' } })"
      :on-click-change-time-zone="() => userModule.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'time_zone' } })"
    />
    <DashboardSettingsAccountCloseAccount class="mb-4" />
  </div>
</template>
