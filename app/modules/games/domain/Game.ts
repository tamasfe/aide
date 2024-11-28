export type GameDevice = "mobile" | "desktop";

export interface GameI {
  id: number;
  image_url: string;
  name: string;
  slug: string;
  description: string | null;
  devices: (GameDevice)[];
}

export interface GameSummaryI {
  id: number;
  image_url: string;
  name: string;
  slug: string;
}
