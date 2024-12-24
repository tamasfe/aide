import type { GameCategoriesRepositoryI } from "../domain/GameCategoriesRepository";
import { GameCategory } from "../domain/GameCategory";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GameCategoriesRepositoryDumb implements GameCategoriesRepositoryI {
  public async searchByGroup(categoryGroup: string, _includeGames: boolean): Promise<Result<GameCategory[], InfrastructureError>> {
    if (categoryGroup === "home") {
      return success([
        GameCategory.new({
          id: 1,
          identifier: "slots",
          games: null,
        }),
        GameCategory.new({
          id: 2,
          identifier: "roulette",
          games: null,
        }),
        GameCategory.new({
          id: 3,
          identifier: "blackjack",
          games: null,
        }),
        GameCategory.new({
          id: 4,
          identifier: "poker",
          games: null,
        }),
      ]);
    }

    return success([]);
  }
}
