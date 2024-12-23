import type { KycApiRepositoryI } from "../domain/KycApiRepository";
import type { KycUserStatus } from "../domain/KycUserStatus";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class KycApiRepositoryGirobet implements KycApiRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async findStatus(): Promise<Result<KycUserStatus, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/kyc/status", {});

      if (data) {
        return success("INACTIVE");
        // return success(data.has_active_kyc ? "ACTIVE" : "INACTIVE");
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({}, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({}, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  public async findAccessToken() {
    try {
      const { data, error, response } = await this.apiClient.GET("/kyc/token", {});

      if (data) {
        return success({
          value: data.token,
          provider: data.provider_identifier,
          applicantData: {
            country: data.user_metadata.country_alpha2,
            email: data.user_metadata.email,
            phone: data.user_metadata.phone_number,
            language: data.user_metadata.language,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({}, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({}, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
