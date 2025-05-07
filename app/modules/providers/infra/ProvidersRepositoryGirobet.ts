import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import type { Provider } from "../domain/Provider";
import { ErrorProviderNotFound } from "../domain/ErrorProviderNotFound";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class ProvidersRepositoryGirobet implements ProvidersRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async searchPaginating(searchParams: { query: string | null }, limit: number, offset: number): Promise<Result<{ providers: Provider[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game-provider/search", {
        params: {
          query: {
            query: searchParams.query,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          providers: data.data.map(provider => camelizeKeys({ ...provider })),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({
            searchParams, limit, offset,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, error),
      );
    }
  }

  public async findByIdentifier(providerIdentifier: string): Promise<Result<Provider, ErrorProviderNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game-provider/{provider_identifier}", {
        params: {
          path: {
            provider_identifier: providerIdentifier,
          },
        },
      });

      if (data) {
        return success(camelizeKeys(data));
      }

      if (error) {
        if (error.code === "GAME_PROVIDER_NOT_FOUND") {
          return fail(
            ErrorProviderNotFound.newFromIdentifier(providerIdentifier),
          );
        }
        return fail(
          InfrastructureError.newFromError({
            providerId: providerIdentifier,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          providerId: providerIdentifier,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          providerId: providerIdentifier,
        }, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
