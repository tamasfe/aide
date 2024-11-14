import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import type { ProviderI } from "../domain/Provider";
import { ErrorProviderNotFound } from "../domain/ErrorProviderNotFound";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class ProvidersRepositoryDumb implements ProvidersRepositoryI {
  public async searchPaginating(searchParams: { query: string | null }, limit: number, offset: number): Promise<Result<{ providers: ProviderI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    this.logger.debug("searchPaginating called", { searchParams, limit, offset });
    return success({
      providers: this.providers.slice(offset, offset + limit),
      pagination: {
        limit,
        offset,
        totalItems: 2,
      },
    });
  }

  public async findById(providerId: number): Promise<Result<ProviderI, ErrorProviderNotFound | InfrastructureError>> {
    this.logger.debug("findById called", { providerId });
    const provider = this.providers.find(provider => provider.id === providerId);
    if (!provider) {
      return fail(ErrorProviderNotFound.newFromId(providerId));
    }
    return success(provider);
  }

  private providers: ProviderI[];
  constructor(private logger: LoggerI) {
    this.providers = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Provider ${i}`,
      slug: `provider-${i}`,
      description: `Description of provider ${i}`,
    })).filter((_, i) => i !== 0);
  }
}
