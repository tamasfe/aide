<script lang="ts" setup>
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();
</script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.account_details')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.username')">
      <template #default>
        <p>banger69.camaro</p>
      </template>
      <template #description>
        <p>Usernames are public and will show in leaderboards.</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.email')">
      <template #default>
        <p>{{ userStore.user?.email }}</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.password')">
      <template #default>
        <p>*************</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('settings', { setting: 'password' })"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.public_id')">
      <template #default>
        <p>{{ userStore.user?.id }}</p>
      </template>
      <template #description>
        <p>
          {{ $t("dashboard.settings.account.id_description") }}
        </p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            class="gap-2"
          >
            <BaseCopy :value="userStore.user?.id || ''" />
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
