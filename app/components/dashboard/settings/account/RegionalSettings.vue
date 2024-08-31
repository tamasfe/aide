<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.regional_settings')">
    <DashboardSectionItem>
      <template #title>
        <p>Wallets</p>
      </template>
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
    <DashboardSectionItem>
      <template #title>
        <p>Language</p>
      </template>
      <template #default>
        <p>English</p>
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
        <p>Time zone</p>
      </template>
      <template #default>
        <p>Brazil (GMT-3) Monday, April 29, 2024, 15:37</p>
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
  </DashboardSection>
</template>
