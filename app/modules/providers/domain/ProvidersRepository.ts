import type { Provider, ProviderSearchResponse } from "./Provider";
import type { ErrorProviderNotFound } from "./ErrorProviderNotFound";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface ProvidersRepositoryI {
  searchPaginating(searchParams: { query: string | null }, limit: number, offset: number): Promise<Result<{
    results: ProviderSearchResponse[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  listPaginating(pagination: { limit: number; offset: number }): Promise<Result<{
    game_providers: Provider[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  findByIdentifier(identifier: string): Promise<Result<Provider, ErrorProviderNotFound | InfrastructureError>>;
}
