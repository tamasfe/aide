import type { ProviderI } from "./Provider";
import type { ErrorProviderNotFound } from "./ErrorProviderNotFound";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface ProvidersRepositoryI {
  searchPaginating(searchParams: { category: string | null; query: string | null }, limit: number, offset: number): Promise<Result<{
    providers: ProviderI[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  findById(id: number): Promise<Result<ProviderI, ErrorProviderNotFound | InfrastructureError>>;
}
