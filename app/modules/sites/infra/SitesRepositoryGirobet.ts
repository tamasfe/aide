import type { SitesRepositoryI } from "../domain/SitesRepository";
import type { SiteResponse } from "../domain/Site";
import type { License } from "../domain/License";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { fail, success, type Result } from "~/packages/result";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class SitesRepositoryGirobet implements SitesRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async findCurrentMatched(): Promise<Result<SiteResponse, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/system/site-setup");

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success({
          ...data,
        });
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  public async findMatchedLicenses(): Promise<Result<License[], InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/system/licenses");

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success(data.map(license => (camelizeKeys(license))));
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
