// THINGS TO CONSIDER
// - "Jurisdiction" is a backend concept which really bundles multiple things together
// - Telephone prefix dropdown does not necessarily correlate with jurisdictions OR locales, however it DOES involve masking which likely would need to be on "Country"

// e8c5df6e-64ba-4597-945a-ceb766797805

export type SupportedCurrencyCode
  = | "BRL";

/**
 * When adding new countries, make sure to add the svg file in the assets' flags folder
 */
export type SupportedCountryFlagCode
  = | "BR"
    | "DE"
    | "ES"
    | "MX"
    | "US";

export type Currency = {
  code: SupportedCurrencyCode;
  symbol: string;
};

export type Country = {
  code: string;
  dialCode: string;
  masks: Masks;
};

export type Jurisdiction = {
  country: Country;
  currency: Currency;
};

export type PhoneMask = string[];
export type CPFMask = string;

export type Masks = {
  phone: PhoneMask;
  cpf?: CPFMask;
};

export type DeviceType = "mobile" | "desktop";

export type Gender = "male" | "female" | "other";

export type GameVolatility
  = | "extreme"
    | "very-high"
    | "high"
    | "medium-high"
    | "medium"
    | "medium-low"
    | "low"
    | "very-low"
    | "none";

export type GameImageVariant
  = | "small"
    | "medium"
    | "large"
    | "extra_large"
    | "background";
