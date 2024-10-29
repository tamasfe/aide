import type { GameI, GameSummaryI } from "./Game";
import type { ErrorGameNotFound } from "./ErrorGameNotFound";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GamesApiRepositoryI {
  searchPaginating(searchParams: { category: string | null; query: string | null }, limit: number, offset: number): Promise<Result<{
    games: GameSummaryI[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  findById(gameId: number): Promise<Result<GameI, ErrorGameNotFound | InfrastructureError>>;
}
