<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.document_settings')">
    <DashboardSectionItem>
      <template #title>
        <p>Key Type</p>
      </template>
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
    <DashboardSectionItem>
      <template #title>
        <p>Key Value</p>
      </template>
      <template #default>
        <p>078.843.426-85</p>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
