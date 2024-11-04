import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { ErrorInvalidAuthCredentials } from "../domain/errors/ErrorInvalidAuthCredentials";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { fail, success, type EmptyResult } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { LoggerI } from "~/packages/logger/Logger";

export class AuthenticationRepositoryGirobet implements AuthenticationRepositoryI {
  constructor(clientOptions: { baseUrl: string; userJurisdiction?: string; headers?: Record<string, string> }, asyncMessagePublisher: AsyncMessagePublisherI, private logger: LoggerI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async login(username: string, password: string): Promise<EmptyResult<ErrorInvalidAuthCredentials | InfrastructureError>> {
    this.logger.debug("Calling login", { username });
    const { data, error, response } = await this.apiClient.POST("/auth/login", {
      body: {
        username,
        password,
      },
    });

    if (data || response.ok) {
      return success();
    }

    if (error) {
      if (error.code === "UNAUTHORIZED") {
        return fail(
          ErrorInvalidAuthCredentials.new(username),
        );
      }

      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(
        InfrastructureError.newFromError({
          username,
        }, httpError),
      );
    }

    return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
  }

  public async logout(): Promise<EmptyResult<InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/auth/logout", {
        redirect: "follow",
      });

      if (data || response.ok) {
        return success();
      }

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(
          InfrastructureError.newFromError({}, httpError),
        );
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({ }, error));
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
