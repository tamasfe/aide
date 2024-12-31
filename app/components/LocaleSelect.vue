<script setup lang="ts">
import type { SupportedLanguage, SupportedLocale } from "~/packages/translation";
import { SUPPORTED_LANGUAGES } from "~/packages/translation/utils";

const { locale, t } = useI18n();
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

/**
 * We need to extend the SupportedLanguage interface to include a "title" property
 * so that we can use them with the BaseSelect component.
 */
interface SupportedLanguageOption extends SupportedLanguage {
  title: string;
}
const SUPPORTED_LANGUAGES_OPTIONS_MAP = computed(() => Object.fromEntries(SUPPORTED_LANGUAGES.map(language => [language.value, ({
  ...language,
  title: capitalize(useLanguageName(language.value, language.value) ?? ""),
})])) as Record<SupportedLocale, SupportedLanguageOption>);
const SUPPORTED_LANGUAGES_OPTIONS = computed(() => Object.values(SUPPORTED_LANGUAGES_OPTIONS_MAP.value));

const accountLanguage = computed<SupportedLanguageOption | null>(() => {
  if (userStore.isAuthenticated && userStore.user.locale) {
    return SUPPORTED_LANGUAGES_OPTIONS_MAP.value[userStore.user.locale];
  }
  return null;
});

const selectedLanguage = ref<SupportedLanguageOption>(SUPPORTED_LANGUAGES_OPTIONS_MAP.value[locale.value]);
const loading = ref(false);
const showChangeAccountLocale = computed<boolean>(() => accountLanguage.value !== null && accountLanguage.value.value !== selectedLanguage.value.value && loading.value === false);

watch([() => SUPPORTED_LANGUAGES_OPTIONS_MAP.value], () => {
  selectedLanguage.value = SUPPORTED_LANGUAGES_OPTIONS_MAP.value[locale.value];
});

const onLocaleSelect = async (language: SupportedLanguageOption) => $dependencies.common.i18n.ui.userSelectsLocale.handle(language.value);
const onClickChangeAccountLocale = async (locale: SupportedLocale) => {
  loading.value = true;
  await $dependencies.users.ui.userSettings.updateLocaleOnLocaleSelect.handle(locale);
  loading.value = false;
};
</script>

<template>
  <div>
    <BaseSelect
      v-model="selectedLanguage"
      :options="SUPPORTED_LANGUAGES_OPTIONS"
      size="sm"
      @change="onLocaleSelect"
    >
      <template #selected="{ selected }">
        <BaseFlag
          v-if="selected"
          :key="selected.countryCode"
          :country-code="selected.countryCode"
          size="lg"
        />
        <span v-if="selected" class="block whitespace-nowrap truncate font-medium text-left">
          {{ selected.title }}
        </span>
      </template>
      <template #option="{ option }">
        <div class="flex items-center gap-2">
          <BaseFlag
            :country-code="option.countryCode"
            size="lg"
          />
          <span>{{ option.title }}</span>
        </div>
      </template>
    </BaseSelect>

    <div v-if="showChangeAccountLocale" class="mt-4 text-sm">
      <p v-if="accountLanguage">{{ t("footer.user_account_language", { language: accountLanguage.title }) }}</p>
      <p v-else>{{ t("footer.user_account_language_unknown") }}</p>
      <BaseButton
        class="mt-2 text-sm"
        variant="secondary"
        @click="onClickChangeAccountLocale(locale)"
      >
        {{ t("footer.change_language", { language: selectedLanguage.title }) }}
      </BaseButton>
    </div>
  </div>
</template>
