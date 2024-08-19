import type { DeviceType, GameVolatility } from "./constants";

export type Game = {
  id: number;
  ext_id: string;
  name: string;
  description: string | null;
  game_aggregator: string;
  game_provider: string;
  categories: number[];
  devices: DeviceType[];
  payout: number;
  volatility: GameVolatility;
  is_hd: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  released_at: string | null;
  recalled_at: string | null;
};

export type UseGamesOptions = {
  categories: string[];
  limit: number;
  offset: number;
};
