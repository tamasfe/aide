import type { SupportedLocale } from "~/packages/translation";

export const useLanguageName = (locale: SupportedLocale, languageCode: string): string | null => {
  return new Intl.DisplayNames([locale], { type: "language", style: "short", languageDisplay: "standard" }).of(languageCode) ?? null;
};
