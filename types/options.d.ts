import type { Currency } from "./constants";

export type TranslationLanguageOption = {
  title: string;
  value: Language;
  countryCode: CountryCode;
};

export type FormatNumberOptions = {
  currency?: Currency;
  decimalPlaces?: number;
  locale: string;
};
