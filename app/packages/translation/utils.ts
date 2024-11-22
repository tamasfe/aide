import type { SupportedLanguage, SupportedLocale } from ".";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { title: "English", value: "en-US" as const, countryCode: "US" as const },
  { title: "Portuguese", value: "pt-BR" as const, countryCode: "BR" as const },
  // { title: "Spanish (Mexico)", value: "es-MX" as const, countryCode: "MX" },
  // { title: "Spanish (Spain)", value: "es-ES" as const, countryCode: "ES" },
];

export const isSimilarToLocale = (string: string, locale: SupportedLocale): boolean => {
  const exactMatch = string === locale;
  if (exactMatch) return true;
  const partialMatch = string.split("-")[0]?.toLowerCase() === locale.split("-")[0]?.toLowerCase();
  return partialMatch;
};

export const isSupportedLocale = (string: string): string is SupportedLocale => {
  return SUPPORTED_LANGUAGES.some(locale => isSimilarToLocale(string, locale.value));
};
