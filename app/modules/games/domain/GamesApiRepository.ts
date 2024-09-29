import type { GameI } from "./Game";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GamesApiRepositoryI {
  searchByCategoryPaginating(category: string, limit: number, offset: number): Promise<Result<{
    games: GameI[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;
}
