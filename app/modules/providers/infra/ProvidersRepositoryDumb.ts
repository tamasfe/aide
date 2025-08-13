import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import type { Provider } from "../domain/Provider";
import { ErrorProviderNotFound } from "../domain/ErrorProviderNotFound";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class ProvidersRepositoryDumb implements ProvidersRepositoryI {
  public async searchPaginating(searchParams: { query: string | null }, limit: number, offset: number): Promise<Result<{ providers: Provider[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
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

  public async listPaginating(pagination: { limit: number; offset: number }) {
    this.logger.debug("listPaginating called", { pagination });
    return success({
      game_providers: this.providers.slice(pagination.offset, pagination.offset + pagination.limit),
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset,
        totalItems: 2,
      },
    });
  }

  public async findByIdentifier(identifier: string): Promise<Result<Provider, ErrorProviderNotFound | InfrastructureError>> {
    this.logger.debug("findById called", { providerId: identifier });
    const provider = this.providers.find(provider => provider.identifier === identifier);
    if (!provider) {
      return fail(ErrorProviderNotFound.newFromIdentifier(identifier));
    }
    return success(provider);
  }

  private providers: Provider[];
  constructor(private logger: LoggerI) {
    this.providers = Array.from({ length: 50 }, (_, i) => ({
      identifier: String(i),
      name: `Provider ${i}`,
      description: `Description of provider ${i}`,
    })).filter((_, i) => i !== 0);
  }
}
