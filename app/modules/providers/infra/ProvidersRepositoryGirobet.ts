import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import type { ProviderI } from "../domain/Provider";
import { ErrorProviderNotFound } from "../domain/ErrorProviderNotFound";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class ProvidersRepositoryGirobet implements ProvidersRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchPaginating(searchParams: { query: string | null }, limit: number, offset: number): Promise<Result<{ providers: ProviderI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
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
          providers: data.data.map(provider => ({
            id: provider.id,
            imageUrl: provider.image_url,
            name: provider.name,
            slug: provider.slug,
            description: null,
          })),
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

  public async findById(providerId: number): Promise<Result<ProviderI, ErrorProviderNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game-provider/{provider_id}", {
        params: {
          path: {
            provider_id: providerId,
          },
        },
      });

      if (data) {
        return success({
          id: data.id,
          imageUrl: data.image_url,
          name: data.name,
          slug: data.slug,
          description: data.description || null,
        });
      }

      if (error) {
        if (error.code === "GAME_PROVIDER_NOT_FOUND") {
          return fail(
            ErrorProviderNotFound.newFromId(providerId),
          );
        }
        return fail(
          InfrastructureError.newFromError({
            providerId,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          providerId,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          providerId,
        }, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
