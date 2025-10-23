<script setup lang="ts">
const nuxtApp = useNuxtApp();
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('account.settings.account.close_account') }}
    </template>
    <template #description>
      {{ $t('account.settings.account.close_account_warning') }}
    </template>

    <ModalCloseAccount />
    <div class="flex">
      <div>
        <BaseButton
          variant="danger"
          size="dashboard"
          @click="nuxtApp.callHook('frontend:command:modal:close-account:open')"
        >
          {{ $t('button.close_account') }}
        </BaseButton>
      </div>
    </div>
  </DashboardSection>
</template>
