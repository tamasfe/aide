import type { Game, GameSearchResponse } from "./Game";
import type { ErrorGameNotFound } from "./ErrorGameNotFound";
import type { ErrorSearchIndexNotFound } from "./ErrorSearchIndexNotFound";
import type { ErrorInvalidGameIdentifier } from "./ErrorInvalidGameIdentifier";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GamesApiRepositoryI {
  searchPaginating(searchParams: { category: string | null; query: string | null; providerIdentifier: string | null }, limit: number, offset: number): Promise<Result<{
    searchResults: GameSearchResponse[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, ErrorSearchIndexNotFound | InfrastructureError>>;

  findByIdentifier(identifier: string): Promise<Result<Game, ErrorGameNotFound | ErrorInvalidGameIdentifier | InfrastructureError>>;
}
