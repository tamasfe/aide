export type GameDevice = "mobile" | "desktop";

export interface GameI {
  id: number;
  imageUrl: string | null;
  name: string;
  slug: string;
  description: string | null;
  devices: (GameDevice)[];
}

export interface GameSummaryI {
  id: number;
  imageUrl: string | null;
  name: string;
  slug: string;
}

export const destructureGameUrlSlug = (slug: string | string[] | undefined): { id: number; identifier: string } | null => {
  if (typeof slug !== "string") return null;
  const [gameId, ...identifierPieces] = slug.split("-");
  if (gameId) {
    const id = Number(gameId);
    if (Number.isNaN(id)) {
      return null;
    }
    return {
      id,
      identifier: identifierPieces.join("-"),
    };
  }
  return null;
};

export const toGameUrlSlug = (id: number, identifier: string): string => {
  if (!identifier) return String(id);
  return `${id}-${identifier}`;
};
