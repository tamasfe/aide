import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import type { Game, GameSearchResponse } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GamesApiRepositoryDumb implements GamesApiRepositoryI {
  public async searchPaginating(searchParams: { category: string | null; query: string | null; providerIdentifier: string | null }, limit: number, offset: number): Promise<Result<{ games: GameSearchResponse[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    this.logger.debug("searchByCategoryPaginating called", { searchParams, limit, offset });
    return success({
      games: this.games.slice(offset, offset + limit).map(game => ({
        ...game,
        identifier: game.identifier,
        name: game.name,
        description: game.description,
        provider: {
          identifier: "evoplay",
          name: "Evoplay",
        },
        isHd: game.isHd,
        devices: game.devices,
        recalledAt: game.recalledAt,
        createdAt: game.createdAt,
      })),
      pagination: {
        limit,
        offset,
        totalItems: 2,
      },
    });
  }

  public async findByIdentifier(identifier: string): Promise<Result<Game, ErrorGameNotFound | InfrastructureError>> {
    this.logger.debug("findById called", { gameId: identifier });
    const game = this.games.find(game => game.identifier === identifier);
    if (!game) {
      return fail(ErrorGameNotFound.newFromGameIdentifier(identifier));
    }
    return success(game);
  }

  private games: Game[];
  constructor(private logger: LoggerI) {
    this.games = Array.from({ length: 50 }, (_, i) => ({
      createdAt: new Date().toISOString(),
      description: `Description of game ${i}`,
      devices: ["desktop" as const],
      identifier: "evoplay/HotRioNights",
      isHd: true,
      name: `Game ${i}`,
      recalledAt: null,
      releaseDate: new Date().toISOString(),
    })).filter((_, i) => i !== 0);
  }
}
