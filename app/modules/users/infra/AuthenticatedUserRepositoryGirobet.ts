import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { User } from "../domain/User";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";

export class AuthenticatedUserSearcherGirobet implements AuthenticatedUserRepositoryI {
  constructor(clientOptions: { baseUrl: string; userJurisdiction: string | undefined; headers?: Record<string, string> }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchProfile(): Promise<Result<User | null, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/user/profile");

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return success(null);
        }

        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success(User.newFromProps({
          id: data.id,
          locale: data.language,
          timeZone: data.time_zone,
          jurisdiction: data.jurisdiction,
          email: data.email,
          telephone: `+${data.phone.code.value}${data.phone.national.value}`,
        }));
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
