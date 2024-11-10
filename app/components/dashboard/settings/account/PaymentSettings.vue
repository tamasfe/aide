<template>
  <DashboardSection :title="$t('dashboard.settings.account.payment_settings')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.key_type')">
      <template #default>
        <p>CPF</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.key_value')">
      <template #default>
        <p>078.843.426-85</p>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
