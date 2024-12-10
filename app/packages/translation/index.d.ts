import type { NumberOptions, DateTimeOptions, Locale as SupportedLocale } from "vue-i18n";

export type TranslateFunctionType = (
  key: string,
  params?: Record<string, string>,
) => string;

export type DateTimeFormatterFunctionType = (
  value: string | number | Date,
  params?: DateTimeOptions,
) => string;

export type NumberFormatterFunctionType = (
  key: number,
  params?: NumberOptions,
) => string;

export type SupportedLocale = SupportedLocale;
export type SupportedLocaleCountry = "BR" | "US";

export type SupportedLanguage = {
  value: SupportedLocale;
  countryCode: SupportedLocaleCountry;
};
