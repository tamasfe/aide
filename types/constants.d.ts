export type Jurisdiction = "BR";

export type Currency = "BRL";

export type Language = "en" | "pt";

export type DeviceType = "mobile" | "desktop";

export type Gender = "male" | "female" | "other";

export type GameVolatility =
  | "extreme"
  | "very-high"
  | "high"
  | "medium-high"
  | "medium"
  | "medium-low"
  | "low"
  | "very-low"
  | "none";

export type GameImageVariant =
  | "small"
  | "medium"
  | "large"
  | "extra_large"
  | "background";

export type CountryCode = {
  name: string;
  code: string;
  dial_code: string;
};
