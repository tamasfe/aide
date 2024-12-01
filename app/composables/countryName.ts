import type { SupportedLocale } from "~/packages/translation";

export const useCountryName = (countryCode: string, locale: SupportedLocale): string | null => {
  return new Intl.DisplayNames([locale], { type: "region" }).of(countryCode) ?? null;
};
