<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.document_settings')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.key_type')">
      <template #default>
        <p>CPF</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            class="w-full bg-emphasis !text-subtle-light hover:!text-emphasis !py-3 !font-medium !rounded-lg"
            type="button"
          >
            Change
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
