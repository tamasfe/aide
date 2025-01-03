<script setup lang="ts">
const walletStore = useWalletStore();
const userSettings = useUserSettingsStore();
const { locale } = useI18n();

defineProps<{
  onClickChangeLanguage: () => void;
  onClickChangeTimeZone: () => void;
}>();

// TODO for multi-currency: Make this dependent on the user's currency
const currency = ref({
  code: "BRL" as const,
  countryCode: "BR" as const,
});
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('dashboard.settings.account.regional_settings') }}
    </template>

    <DashboardSectionItem v-if="walletStore.wallet" :name="$t('dashboard.settings.account.wallets')">
      <template #default>
        <div class="flex items-center gap-2">
          <BaseFlag
            :country-code="currency.countryCode"
          />
          <p>{{ walletStore.wallet.currency }} (ID: #{{ walletStore.wallet.walletId }})</p>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem v-if="userSettings.settings" :name="$t('dashboard.settings.account.language')">
      <template #default>
        <p>{{ userSettings.settings.locale ? useLanguageName(locale, userSettings.settings.locale) : '' }}</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="onClickChangeLanguage"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem v-if="userSettings.settings" :name="$t('dashboard.settings.account.time_zone')">
      <template #default>
        <p>{{ userSettings.settings.timeZone }}</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="onClickChangeTimeZone"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
