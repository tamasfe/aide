<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.close_account')">
    <div class="flex flex-col sm:flex-row sm:justify-between gap-x-24 gap-y-4">
      <div class="text-subtle-light font-medium">
        {{ $t('dashboard.settings.account.close_account_warning') }}
      </div>
      <div>
        <BaseButton
          class="w-full bg-button-danger hover:text-emphasis !py-3 !font-medium !rounded-lg"
          type="button"
        >
          {{ $t('button.close_account') }}
        </BaseButton>
      </div>
    </div>
  </DashboardSection>
</template>
