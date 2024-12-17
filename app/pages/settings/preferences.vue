<script setup lang="ts">
import { useThrottleFn, watchDeep } from "@vueuse/core";

const { $dependencies } = useNuxtApp();
const userSettingsStore = useUserSettingsStore();
const { t } = useI18n();

const promotionsPreferences = ref<null | {
  email: boolean;
  phone: boolean;
  browser: boolean;
}>(null);

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data: errorLoading } = await useAsyncData(`settings-preferences-user-settings`,
  async () => {
    if (!userSettingsStore.settings) {
      await userSettingsStore.refresh();
    }

    if (userSettingsStore.settings) {
      promotionsPreferences.value = {
        email: userSettingsStore.settings.simplifiedConsents.email ?? false,
        phone: userSettingsStore.settings.simplifiedConsents.phone ?? false,
        browser: userSettingsStore.settings.simplifiedConsents.browser ?? false,
      };
      return "";
    }

    promotionsPreferences.value = null;
    return t("dashboard.settings.preferences.error_loading_settings");
  },
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

watchDeep(() => promotionsPreferences.value,
  useThrottleFn(
    async () => {
      if (!promotionsPreferences.value || !userSettingsStore.settings) return;
      await $dependencies.users.ui.userSettings.updateConsentsOnPreferencesPage.handle(userSettingsStore.settings.simplifiedConsents, promotionsPreferences.value);
    },
    150, true, true, true), { immediate: false },
);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <DashboardSection :title="$t('dashboard.settings.preferences.bonuses')" class="text-subtle">
      <BaseAlert
        v-if="errorLoading"
        :message="errorLoading"
        level="error"
        class="mb-2"
      />
      <div v-if="!errorLoading" class="w-full lg:max-w-72">
        <div v-if="!promotionsPreferences" class="w-full flex items-center justify-center">
          <BaseSpinner :size="24" />
        </div>
        <div v-if="promotionsPreferences">
          <p>{{ $t("dashboard.settings.preferences.bonuses_description") }}</p>
          <div class="mt-8 space-y-8">
            <BaseToggle v-model="promotionsPreferences.email">
              <p>{{ $t("dashboard.settings.preferences.bonuses_by_email") }}</p>
            </BaseToggle>

            <BaseToggle v-model="promotionsPreferences.phone">
              <p>{{ $t("dashboard.settings.preferences.bonuses_by_phone") }}</p>
            </BaseToggle>

            <BaseToggle v-model="promotionsPreferences.browser">
              <p>{{ $t("dashboard.settings.preferences.bonuses_by_browser") }}</p>
            </BaseToggle>
          </div>
        </div>
      </div>
    </DashboardSection>

    <DashboardSection :title="$t('dashboard.settings.preferences.communication')" class="text-subtle">
      <!-- <BaseToggle
        v-model=""
        class="w-full lg:max-w-72"
      >
        <p>{{ $t("dashboard.settings.preferences.communications_allow_deposit") }}</p>
      </BaseToggle> -->
    </DashboardSection>
  </NuxtLayout>
</template>
