<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const userSettings = useUserSettingsStore();

const supportedTimeZoneOptions = Intl.supportedValuesOf("timeZone").map(timeZone => ({
  value: timeZone,
  title: timeZone,
}));

const selectedTimezone = ref(supportedTimeZoneOptions.find(supportedTimeZone => supportedTimeZone.value === userSettings.settings?.timeZone)?.value);

const onSubmit = async () => {
  if (!selectedTimezone.value || !userSettings.settings) {
    return;
  }
  /**
   * We do not await and emit the command to close the modal immediately to increase snapiness of the UI,
   * if there an error: we will be notified with the error logger.
   * This way the user can see the changes immediately.
   */
  userSettings.settings.timeZone = selectedTimezone.value;
  $dependencies.users.ui.userSettings.updateSettingsOnForm.handle({ timeZone: selectedTimezone.value });
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};

/**
 *
 * Combobox
 *
 */
const filteredOptions = computed(() => {
  return supportedTimeZoneOptions;
});
</script>

<template>
  <BaseForm v-if="userSettings.settings" @submit="onSubmit">
    <template #default="{ loading }">
      <BaseCombobox
        v-model="selectedTimezone"
        :options="filteredOptions"
      />

      <div
        class="flex items-center justify-between space-x-4"
      >
        <BaseButton
          size="xl"
          variant="subtle"
          class="w-full space-x-1.5"
          type="button"
          @click="$dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
        >
          {{ $t("button.cancel") }}
        </BaseButton>

        <BaseButton
          :loading="loading"
          size="xl"
          class="w-full space-x-1.5"
          :disabled="!selectedTimezone"
          type="submit"
        >
          {{ $t("button.save") }}
        </BaseButton>
      </div>
    </template>
  </BaseForm>
</template>
