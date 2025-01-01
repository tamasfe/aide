<script setup lang="ts">
const { $dependencies } = useNuxtApp();
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('dashboard.settings.account.close_account') }}
    </template>
    <template #description>
      {{ $t('dashboard.settings.account.close_account_warning') }}
    </template>

    <div class="flex">
      <div>
        <BaseButton
          variant="danger"
          size="dashboard"
          @click="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('close_account')"
        >
          {{ $t('button.close_account') }}
        </BaseButton>
      </div>
    </div>
  </DashboardSection>
</template>
