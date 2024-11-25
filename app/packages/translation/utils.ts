import type { SupportedLanguage, SupportedLocale } from ".";

export const SUPPORTED_LANGUAGES_MAP: Record<SupportedLocale, SupportedLanguage> = {
  "en-US": { value: "en-US" as const, countryCode: "US" as const },
  "pt-BR": { value: "pt-BR" as const, countryCode: "BR" as const },
  // "es-MX": { value: "es-MX" as const, countryCode: "MX" },
  // "es-ES": { value: "es-ES" as const, countryCode: "ES" },
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
