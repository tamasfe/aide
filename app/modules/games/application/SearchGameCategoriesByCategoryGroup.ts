import type { GameCategoriesRepositoryI } from "../domain/GameCategoriesRepository";
import { success } from "~/packages/result";

export class SearchGameCategoriesByCategoryGroup {
  constructor(private readonly categoryRepo: GameCategoriesRepositoryI) {}

  public async handle(group: string, includeGames: boolean) {
    const result = await this.categoryRepo.searchByGroup(group, includeGames);
    if (result.isFailure) {
      return result;
    }

    return success(result.value.map(category => category.toJSON()));
  }
}
