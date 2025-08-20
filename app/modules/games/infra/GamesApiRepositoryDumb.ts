import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import type { Game } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GamesApiRepositoryDumb implements GamesApiRepositoryI {
  public async searchPaginating(searchParams: { category: string | null; query: string | null; providerIdentifier: string | null }, pagination: { limit: number; offset: number }) {
    this.logger.debug("searchPaginating called", { searchParams, pagination });
    return success({
      results: this.games.slice(pagination.offset, pagination.offset + pagination.limit).map(game => ({
        score: 0.5, // Dummy score for the sake of example
        item: {
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
        },
      })),
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset,
        totalItems: 2,
      },
    });
  }

  public async listPaginating(searchParams: { category: string | null; query: string | null; providerIdentifier: string | null }, pagination: { limit: number; offset: number }) {
    this.logger.debug("listPaginating called", { searchParams, pagination });
    return success({
      games: this.games.slice(pagination.offset, pagination.offset + pagination.limit).map(game => ({
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
      })),
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset,
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
      categories: [],
    })).filter((_, i) => i !== 0);
  }
}
