<script setup lang="ts">
const userModule = useUserModule();
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('account.settings.account.close_account') }}
    </template>
    <template #description>
      {{ $t('account.settings.account.close_account_warning') }}
    </template>

    <div class="flex">
      <div>
        <BaseButton
          variant="danger"
          size="dashboard"
          @click="() => userModule.ui.emitCommandOpenUserActionModal.handle('close_account')"
        >
          {{ $t('button.close_account') }}
        </BaseButton>
      </div>
    </div>
  </DashboardSection>
</template>
