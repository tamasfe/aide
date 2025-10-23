<script setup lang="ts">
import type { SettingsPayload } from "~/types/hooks";

const nuxtApp = useNuxtApp();
const userSettingsStore = useUserSettingsStore();
const userStore = useUserStore();
const open = ref(false);
const setting = ref<SettingsPayload | null>(null);

useActiveModals("settings", open);

useRuntimeHook("frontend:command:modal:settings:open", (data) => {
  setting.value = data;
  open.value = true;
});

useRuntimeHook("frontend:command:modal:settings:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:settings:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:settings:closed");
    setting.value = null;
  }
});
</script>

<template>
  <BaseModal
    id="base-modal-update-settings"
    v-model:open="open"
    :logo="false"
  >
    <template #title>
      <span v-if="setting === 'username'">
        {{ $t('modal_account_settings.username.title') }}
      </span>
      <span v-else-if="setting === 'password'">
        {{ $t('modal_account_settings.password.title') }}
      </span>
      <span v-else-if="setting === 'language'">
        {{ $t('modal_account_settings.language.title') }}
      </span>
      <span v-else-if="setting === 'time_zone'">
        {{ $t('modal_account_settings.time_zone.title') }}
      </span>
      <span v-else-if="setting === 'payment_pix'">
        {{ $t('modal_account_settings.payment_pix.title') }}
      </span>
    </template>

    <FormSettingsPassword v-if="setting === 'password'" />
    <FormSettingsLocale v-if="setting === 'language'" />
    <FormSettingsTimeZone v-if="setting === 'time_zone'" />
    <FormSettingsUsername v-if="setting === 'username'" :initial="userStore.user?.username || ''" />
    <FormSettingsPixPayment
      v-if="setting === 'payment_pix' && userSettingsStore.settings"
      :payment-settings="userSettingsStore.settings.payment"
      :initial-data="userStore.user ? {
        email: userStore.user.email,
        phone: userStore.user.phone,
      }: undefined"
    />
  </BaseModal>
</template>
