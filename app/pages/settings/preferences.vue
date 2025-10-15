<script setup lang="ts">
import { useThrottleFn, watchDeep } from "@vueuse/core";

const { $dependencies } = useNuxtApp();
const userSettingsStore = useUserSettingsStore();
const { t } = useI18n();

useHead({
  title: t("page.account_settings"),
});

const promotionsPreferences = ref<{
  email: boolean;
  phone: boolean;
  browser: boolean;
}>({
  email: userSettingsStore.settings?.simplifiedConsents.email ?? false,
  phone: userSettingsStore.settings?.simplifiedConsents.phone ?? false,
  browser: userSettingsStore.settings?.simplifiedConsents.browser ?? false,
});
const errorUpdating = ref<string | null>(null);

callOnce("settings-preferences-refresh-user-settings", async () => {
  if (userSettingsStore.status === "unititialized") {
    await userSettingsStore.refresh();
    if (userSettingsStore.settings) {
      promotionsPreferences.value = {
        email: userSettingsStore.settings.simplifiedConsents.email ?? false,
        phone: userSettingsStore.settings.simplifiedConsents.phone ?? false,
        browser: userSettingsStore.settings.simplifiedConsents.browser ?? false,
      };
    }
  }
});

watchDeep(() => promotionsPreferences.value,
  useThrottleFn(
    async () => {
      if (!promotionsPreferences.value || !userSettingsStore.settings) return;
      errorUpdating.value = await $dependencies.users.ui.userSettings.updateConsentsOnPreferencesPage.handle(userSettingsStore.settings.simplifiedConsents, promotionsPreferences.value);
    },
    150, true, true, true), { immediate: false },
);
</script>

<template>
  <DashboardSection class="text-subtle">
    <template #title>
      {{ $t("account.settings.preferences.bonuses") }}
    </template>
    <template #description>
      {{ $t("account.settings.preferences.bonuses_description") }}
    </template>
    <BaseAlert
      v-if="errorUpdating"
      :message="errorUpdating"
      level="error"
      class="mb-2"
    />
    <div class="w-full lg:max-w-72">
      <div v-if="promotionsPreferences" class="space-y-4">
        <BaseToggle v-model="promotionsPreferences.email">
          <p>{{ $t("account.settings.preferences.bonuses_by_email") }}</p>
        </BaseToggle>

        <BaseToggle v-model="promotionsPreferences.phone">
          <p>{{ $t("account.settings.preferences.bonuses_by_phone") }}</p>
        </BaseToggle>

        <BaseToggle v-model="promotionsPreferences.browser">
          <p>{{ $t("account.settings.preferences.bonuses_by_browser") }}</p>
        </BaseToggle>
      </div>
    </div>
  </DashboardSection>
</template>
