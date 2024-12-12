<script setup lang="ts">
const walletStore = useWalletStore();
const userSettings = useUserSettingsStore();
const { locale } = useI18n();
const { $dependencies } = useNuxtApp();

// TODO for multi-currency: Make this dependent on the user's currency
const currency = ref({
  code: "BRL" as const,
  countryCode: "BR" as const,
});
</script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.regional_settings')">
    <DashboardSectionItem v-if="walletStore.wallet" :name="$t('dashboard.settings.account.wallets')">
      <template #default>
        <div class="flex items-center gap-2">
          <BaseFlag
            :country-code="currency.countryCode"
            size="xl"
          />
          <p>{{ walletStore.wallet.currency }} (ID: #{{ walletStore.wallet.id }})</p>
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
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'language' } })"
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
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'time_zone' } })"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
