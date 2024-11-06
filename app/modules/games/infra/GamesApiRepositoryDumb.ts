import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import type { GameI, GameSummaryI } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GamesApiRepositoryDumb implements GamesApiRepositoryI {
  public async searchPaginating(searchParams: { category: string | null; query: string | null; providerId: number | null }, limit: number, offset: number): Promise<Result<{ games: GameSummaryI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    this.logger.debug("searchByCategoryPaginating called", { searchParams, limit, offset });
    return success({
      games: this.games.slice(offset, offset + limit),
      pagination: {
        limit,
        offset,
        totalItems: 2,
      },
    });
  }

  public async findById(gameId: number): Promise<Result<GameI, ErrorGameNotFound | InfrastructureError>> {
    this.logger.debug("findById called", { gameId });
    const game = this.games.find(game => game.id === gameId);
    if (!game) {
      return fail(ErrorGameNotFound.newFromGameId(gameId));
    }
    return success(game);
  }

  private games: GameI[];
  constructor(private logger: LoggerI) {
    this.games = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Game ${i}`,
      slug: `game-${i}`,
      description: `Description of game ${i}`,
      devices: ["desktop" as const],
    })).filter((_, i) => i !== 0);
  }
}
