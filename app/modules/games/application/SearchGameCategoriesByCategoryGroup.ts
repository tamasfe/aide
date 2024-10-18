import type { GameCategoriesRepositoryI } from "../domain/GameCategoriesRepository";
import { success } from "~/packages/result";

export class SearchGameCategoriesByCategoryGroup {
  constructor(private readonly categoryRepo: GameCategoriesRepositoryI) {}

  public async handle(group: string) {
    const result = await this.categoryRepo.searchByGroup(group);
    if (result.isFailure) {
      return result;
    }

    return success(result.value.map(category => category.toJSON()));
  }
}
