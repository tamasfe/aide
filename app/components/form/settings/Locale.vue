<script setup lang="ts">
import type { SupportedLanguage, SupportedLocale } from "~/packages/translation";
import { SUPPORTED_LANGUAGES } from "~/packages/translation/utils";

const { $dependencies } = useNuxtApp();
const userSettings = useUserSettingsStore();
const { locale } = useI18n();

/**
 * We need to extend the SupportedLanguage interface to include a "title" property
 * so that we can use them with the BaseSelect component.
 */
interface SupportedLanguageOption extends SupportedLanguage {
  title: string;
}
const SUPPORTED_LANGUAGES_OPTIONS_MAP = computed(() => Object.fromEntries(SUPPORTED_LANGUAGES.map(language => [language.value, ({
  ...language,
  title: capitalize(useLanguageName(locale.value, language.value) ?? ""),
})])) as Record<SupportedLocale, SupportedLanguageOption>);
const SUPPORTED_LANGUAGES_OPTIONS = computed(() => Object.values(SUPPORTED_LANGUAGES_OPTIONS_MAP.value));

const selectedLanguage = ref<SupportedLanguageOption | undefined>(
  userSettings.settings?.locale ? SUPPORTED_LANGUAGES_OPTIONS_MAP.value[userSettings.settings.locale] : undefined,
);

const onSubmit = async () => {
  if (!selectedLanguage.value || !userSettings.settings) {
    return;
  }
  /**
   * We do not await and emit the command to close the modal immediately to increase snapiness of the UI,
   * if there an error: we will be notified with the error logger.
   * This way the user can see the changes immediately.
   */
  userSettings.settings.locale = selectedLanguage.value.value;
  $dependencies.users.ui.userSettings.updateSettingsOnForm.handle({ locale: selectedLanguage.value.value });
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseForm v-if="userSettings.settings" class="space-y-4" @submit="onSubmit">
    <template #default="{ loading }">
      <div class="leading-snug">
        <h2 class="text-xl font-semibold">{{ $t('modal_user_settings.language.title') }}</h2>
      </div>

      <BaseSelect
        v-model="selectedLanguage"
        :options="SUPPORTED_LANGUAGES_OPTIONS"
        size="md"
        variant="subtle"
        @change="value => selectedLanguage = value"
      >
        <template #selected="{ selected }">
          <BaseFlag
            v-if="selected"
            :key="selected.countryCode"
            :country-code="selected.countryCode"
          />
          <span v-if="selected" class="block whitespace-nowrap truncate font-medium text-left">
            {{ selected.title }}
          </span>
        </template>
        <template #option="{ option }">
          <div class="flex items-center gap-2">
            <BaseFlag
              :country-code="option.countryCode"
            />
            <span>{{ option.title }}</span>
          </div>
        </template>
      </BaseSelect>

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
          :disabled="!selectedLanguage"
          type="submit"
        >
          {{ $t("button.save") }}
        </BaseButton>
      </div>
    </template>
  </BaseForm>
</template>
