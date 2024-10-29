import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { success } from "~/packages/result";

export class SearchGamesPaginating {
  constructor(private apiRepository: GamesApiRepositoryI) {}

  public async handle(categoryIdentifier: string | null, query: string | null, page: number, pageSize: number) {
    const gamesResult = await this.apiRepository.searchPaginating({ category: categoryIdentifier, query }, pageSize, page * pageSize);
    if (gamesResult.isFailure) {
      return gamesResult;
    }

    return success(gamesResult.value);
  }
}
