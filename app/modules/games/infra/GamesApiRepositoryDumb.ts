import type { GameI } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GamesApiRepositoryDumb implements GamesApiRepositoryI {
  public async searchByCategoryPaginating(category: string, limit: number, offset: number): Promise<Result<{ games: GameI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    console.debug("searchByCategoryPaginating called with...", category, limit, offset);
    return success({
      games: this.games.slice(offset, offset + limit),
      pagination: {
        limit,
        offset,
        totalItems: 2,
      },
    });
  }

  private games: GameI[];
  constructor() {
    this.games = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Game ${i}`,
      slug: `game-${i}`,
    })).filter((_, i) => i !== 0);
  }
}
