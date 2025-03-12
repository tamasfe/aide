import type { GameAction } from "./GameAction";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GameActionsRepositoryI {
  searchPaginating(searchParams: { type: "bet" | "win" | null }, limit: number, offset: number): Promise<Result<{
    gameActions: GameAction[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;
}
