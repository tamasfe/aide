<template>
  <DashboardSection :title="$t('dashboard.settings.account.regional_settings')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.wallets')">
      <template #default>
        <div class="flex items-center gap-2">
          <BaseFlag
            :country-code="'BR'"
            size="lg"
          />
          <p>BRL (ID: #292482)</p>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.language')">
      <template #default>
        <p>English</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.time_zone')">
      <template #default>
        <p>Brazil (GMT-3) Monday, April 29, 2024, 15:37</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
