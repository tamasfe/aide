<script setup lang="ts">
const userStore = useUserStore();
const { locale } = useI18n();
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('dashboard.settings.account.personal_details') }}
    </template>

    <DashboardSectionItem :name="$t('dashboard.settings.account.name')">
      <template #default>
        <p>{{ userStore.user?.name || '' }} {{ userStore.user?.familyName || '' }}</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.phone')">
      <template #default>
        <p>+{{ userStore.user?.phone.code.value }} {{ userStore.user?.phone.national.value }}</p>
      </template>
      <!-- Hiding it until we allow for editing, need to think about KYC implications <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template> -->
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.date_of_birth')">
      <template #default>
        <p>{{ userStore.user?.birthdate ? $d(new Date(userStore.user.birthdate)) : '' }}</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.address')">
      <template #default>
        <p>{{ userStore.user?.address?.address_lines?.join(', ') || '' }}</p>
      </template>
      <!-- Hiding it until we allow for editing, need to think about KYC implications <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template> -->
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.city')">
      <template #default>
        <p>{{ userStore.user?.address?.locality || '' }}</p>
      </template>
      <!-- Hiding it until we allow for editing, need to think about KYC implications <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template> -->
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.postal_code')">
      <template #default>
        <p>{{ userStore.user?.address?.postal_code || '' }}</p>
      </template>
      <!-- Hiding it until we allow for editing, need to think about KYC implications <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template> -->
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.country')">
      <template #default>
        <p>{{ userStore.user?.address?.country ? (useCountryName(userStore.user?.address?.country, locale) || '') : '' }}</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.document')">
      <template #default>
        <p>{{ userStore.user?.cpf ? 'CPF: ' + userStore.user?.cpf : '' }}</p>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
