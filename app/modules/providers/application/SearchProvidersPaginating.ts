import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import { success } from "~/packages/result";

export class SearchProvidersPaginating {
  constructor(private apiRepository: ProvidersRepositoryI) {}

  public async handle(query: string | null, page: number, pageSize: number) {
    const gamesResult = await this.apiRepository.searchPaginating({ query }, pageSize, page * pageSize);
    if (gamesResult.isFailure) {
      return gamesResult;
    }

    return success(gamesResult.value);
  }
}
