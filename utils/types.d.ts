export type CountryCode = {
  name: string;
  code: string;
  dial_code: string;
};

export type FormatNumberOptions = {
  currency?: string;
  decimalPlaces?: number;
  locale: string;
};
