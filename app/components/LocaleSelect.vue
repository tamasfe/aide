<script setup lang="ts">
import type { SupportedLanguage } from "~/packages/translation";
import { SUPPORTED_LANGUAGES, isSimilarToLocale } from "~/packages/translation/utils";

const { locale } = useI18n();
const { $dependencies } = useNuxtApp();

const initialOption: SupportedLanguage | undefined = SUPPORTED_LANGUAGES.find(
  option => isSimilarToLocale(option.value, locale.value),
);

const onLocaleSelect = async (locale: SupportedLanguage) => $dependencies.common.i18n.ui.userSelectsLocale.handle(locale.value);
</script>

<template>
  <BaseSelect
    :options="SUPPORTED_LANGUAGES"
    :initial-selected-option="initialOption"
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
      <span class="block whitespace-nowrap truncate font-medium text-left">
        {{ selected?.title }}
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
</template>
