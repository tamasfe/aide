<script lang="ts" setup>
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();
</script>

<template>
  <DashboardSection>
    <template #title>
      {{ $t('account.settings.account.account_details') }}
    </template>

    <DashboardSectionItem :name="$t('account.settings.account.username')">
      <template #default>
        <p>{{ userStore.user?.username || '' }}</p>
      </template>
      <template #description>
        <p>{{ $t("account.settings.account.username_description") }}</p>
      </template>
      <template #actions>
        <div class="flex items-center gap-4">
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'username' } })"
          >
            {{ $t('button.edit') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('account.settings.account.email')">
      <template #default>
        <p>{{ userStore.user?.email }}</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('account.settings.account.password')">
      <template #default>
        <p>*************</p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: 'settings', data: { setting: 'password' } })"
          >
            {{ $t('button.change') }}
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('account.settings.account.public_id')">
      <template #default>
        <p>{{ userStore.user?.id }}</p>
      </template>
      <template #description>
        <p>
          {{ $t("account.settings.account.id_description") }}
        </p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            variant="secondary"
            size="dashboard"
            class="px-0"
          >
            <BaseCopy class="px-3" :value="String(userStore.user?.id || '')" />
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
