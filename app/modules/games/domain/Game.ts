export type GameDevice = "mobile" | "desktop";

export interface GameI {
  id: number;
  imageUrl: string;
  name: string;
  slug: string;
  description: string | null;
  devices: (GameDevice)[];
}

export interface GameSummaryI {
  id: number;
  imageUrl: string;
  name: string;
  slug: string;
}
