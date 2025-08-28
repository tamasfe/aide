import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { ErrorInvalidAuthCredentials } from "../domain/errors/ErrorInvalidAuthCredentials";
import { ErrorInvalidPasswordRecoveryToken } from "../domain/errors/ErrorInvalidPasswordRecoveryToken";
import type { UserEmail } from "../domain/UserEmail";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { fail, success, type EmptyResult } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import type { LoggerI } from "~/packages/logger/Logger";
import { ErrorUnauthorized } from "../domain/errors/ErrorUnauthorized";

export class AuthenticationRepositoryGirobet implements AuthenticationRepositoryI {
  private logger: LoggerI;
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
    this.logger = commonDependencies.logger;
  }

  public async login(username: string, password: string): Promise<EmptyResult<ErrorInvalidAuthCredentials | InfrastructureError>> {
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

  public async logout(): Promise<EmptyResult<ErrorUnauthorized | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.POST("/auth/logout");

      if (data || response.ok) {
        return success();
      }

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        if (httpError.code === "UNAUTHORIZED") {
          return fail(new ErrorUnauthorized("logout"));
        }
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

  public async requestResetPassword(email: UserEmail): Promise<EmptyResult<InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.POST("/auth/forgot-password", {
        body: {
          email: email.value,
        },
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

  public async resetPassword(newPassword: string, token: string): Promise<EmptyResult<ErrorInvalidPasswordRecoveryToken | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.POST("/auth/reset-password", {
        body: {
          password: newPassword,
          token,
        },
      });

      if (data || response.ok) {
        return success();
      }

      if (error) {
        if (response.status === 422 || error.code === "UNAUTHORIZED") {
          return fail(
            ErrorInvalidPasswordRecoveryToken.new(token),
          );
        }

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
