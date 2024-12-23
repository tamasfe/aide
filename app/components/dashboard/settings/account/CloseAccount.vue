<script setup lang="ts">
const { $dependencies } = useNuxtApp();
</script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.close_account')">
    <div class="flex flex-col sm:flex-row sm:justify-between gap-x-24 gap-y-4">
      <div class="text-subtle-light font-medium">
        {{ $t('dashboard.settings.account.close_account_warning') }}
      </div>
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
