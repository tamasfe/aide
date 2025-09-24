import type { Game, GameSearchResponse } from "./Game";
import type { ErrorGameNotFound } from "./ErrorGameNotFound";
import type { ErrorInvalidGameIdentifier } from "./ErrorInvalidGameIdentifier";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GamesApiRepositoryI {
  searchPaginating(searchParams: { query: string | null }, pagination: { limit: number; offset: number }): Promise<Result<{
    results: GameSearchResponse[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  listPaginating(searchParams: { category: string | null; providerIdentifier: string | null }, pagination: { limit: number; offset: number }): Promise<Result<{
    games: Game[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  findByIdentifier(identifier: string): Promise<Result<Game, ErrorGameNotFound | ErrorInvalidGameIdentifier | InfrastructureError>>;
}
