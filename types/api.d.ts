export type ValidationError<T = Record<string, unknown>> = {
  code: string;
  message: string;
  metadata: ValidationErrorMetadata<T>;
};

export type Metadata<T = Record<string, unknown>> = {
  code: string;
  message: string;
  params: T;
};

export type ValidationErrorMetadata<T = Record<string, unknown>> = {
  [key: string]: Metadata<T>[];
};

export type GameImageVariant =
  | "small"
  | "medium"
  | "large"
  | "extra_large"
  | "background";

export type ApiData<T> = {
  data: T;
};

export type Volatility =
  | "none"
  | "very-low"
  | "low"
  | "medium-low"
  | "medium"
  | "medium-high"
  | "high"
  | "very-high"
  | "extreme";

export type Game = {
  id: number;
  categories: number[];
  created_at: string;
  description: string | null;
  ext_id: string;
  name: string;
  devices: string[];
  game_aggregator: "softswiss";
  game_provider: string;
  is_hd: boolean;
  metadata: Record<string, unknown>;
  name: string;
  payout: string;
  recalled_at: string | null;
  released_at: string;
  volatility: Volatiliy;
};

export type Category = {
  id: number;
  identifier: string;
};
