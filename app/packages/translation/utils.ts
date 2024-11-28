import type { SupportedLanguage, SupportedLocale } from ".";

export const SUPPORTED_LANGUAGES_MAP: Record<SupportedLocale, SupportedLanguage> = {
  "en-us": { value: "en-us" as const, countryCode: "US" as const },
  "pt-br": { value: "pt-br" as const, countryCode: "BR" as const },
  // "es-mx": { value: "es-mx" as const, countryCode: "MX" },
  // "es-es": { value: "es-es" as const, countryCode: "ES" },
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = Object.values(SUPPORTED_LANGUAGES_MAP);

export const localeToLanguage = (locale: SupportedLocale): SupportedLanguage | undefined => {
  return SUPPORTED_LANGUAGES.find(language => language.value === locale);
};

const isSimilarToLocale = (string: string, locale: SupportedLocale): boolean => {
  const exactMatch = string === locale;
  if (exactMatch) return true;
  const partialMatch = string.split("-")[0]?.toLowerCase() === locale.split("-")[0]?.toLowerCase();
  return partialMatch;
};

export const isSupportedLocale = (string: string): string is SupportedLocale => {
  return SUPPORTED_LANGUAGES.some(language => string === language.value);
};

export const searchSimilarLocale = (string: string): SupportedLocale | null => {
  const exactMatch = SUPPORTED_LANGUAGES.find(locale => locale.value === string);
  if (exactMatch) return exactMatch.value;
  const partialMatch = SUPPORTED_LANGUAGES.find(locale => isSimilarToLocale(string, locale.value));
  return partialMatch?.value ?? null;
};
