import type { GameCategoriesRepositoryI } from "../domain/GameCategoriesRepository";
import { GameCategory } from "../domain/GameCategory";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GameCategoriesRepositoryDumb implements GameCategoriesRepositoryI {
  public async searchByGroup(categoryGroup: string): Promise<Result<GameCategory[], InfrastructureError>> {
    if (categoryGroup === "home") {
      return success([
        GameCategory.new({
          id: 1,
          identifier: "slots",
        }),
        GameCategory.new({
          id: 2,
          identifier: "roulette",
        }),
        GameCategory.new({
          id: 3,
          identifier: "blackjack",
        }),
        GameCategory.new({
          id: 4,
          identifier: "poker",
        }),
      ]);
    }

    return success([]);
  }
}
