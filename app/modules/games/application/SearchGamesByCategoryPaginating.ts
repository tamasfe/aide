import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { success } from "~/packages/result";

export class SearchGamesByCategoryPaginating {
  constructor(private apiRepository: GamesApiRepositoryI) {}

  public async handle(categoryIdentifier: string, page: number, pageSize: number) {
    const gamesResult = await this.apiRepository.searchByCategoryPaginating(categoryIdentifier, pageSize, page * pageSize);
    if (gamesResult.isFailure) {
      return gamesResult;
    }

    return success(gamesResult.value);
  }
}
