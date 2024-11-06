import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import { success } from "~/packages/result";

export class FindProviderById {
  constructor(private readonly providerRepo: ProvidersRepositoryI) {}

  public async handle(id: number) {
    const providerResult = await this.providerRepo.findById(id);
    if (providerResult.isFailure) {
      return providerResult;
    }

    return success(providerResult.value);
  }
}
