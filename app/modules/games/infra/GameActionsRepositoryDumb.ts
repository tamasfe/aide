import type { GameActionI } from "../domain/GameAction";
import type { GameActionsRepositoryI } from "../domain/GameActionsRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GameActionsRepositoryDumb implements GameActionsRepositoryI {
  public async searchPaginating(searchParams: { type: "bet" | "win" | null }, limit: number, offset: number): Promise<Result<{ gameActions: GameActionI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    this.logger.debug("searchPaginating called", { searchParams, limit, offset });
    return success({
      gameActions: [],
      pagination: {
        limit,
        offset,
        totalItems: 0,
      },
    });
  }

  constructor(private logger: LoggerI) {}
}
