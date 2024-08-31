<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.personal_details')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.name')">
      <template #default>
        <p>Pedro</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.phone')">
      <template #default>
        <p>+55 (61) 314 202 63</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.date_of_birth')">
      <template #default>
        <p>24.02.1990</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.address')">
      <template #default>
        <p>Viaduto do Chá, 15</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.city')">
      <template #default>
        <p>SÃO PAULO - SP</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.postal_code')">
      <template #default>
        <p>01002-020</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.country')">
      <template #default>
        <p>Brasil</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.document')">
      <template #default>
        <p>CPF: 111-222</p>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
