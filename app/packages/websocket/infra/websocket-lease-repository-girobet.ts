import type { WebsocketAccessTokenRepositoryI } from "../domain/websocket-access-token-repository";
import { WebsocketAccessToken } from "../domain/websocket-access-token";
import { ErrorUnauthorizedForWebsocketConnection } from "../domain/error-unauthorized-for-websocket-connection";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class WebsocketLeaseRepositoryGirobet implements WebsocketAccessTokenRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async create(channel: "user"): Promise<Result<WebsocketAccessToken, ErrorUnauthorizedForWebsocketConnection | InfrastructureError>> {
    try {
      if (channel !== "user") {
        throw new Error("Unsupported channel to get access token");
      }

      const { data, error, response } = await this.apiClient.POST("/ws/access-token", {});

      if (data) {
        return success(WebsocketAccessToken.newUserToken(data.token));
      }

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return fail(
            new ErrorUnauthorizedForWebsocketConnection(),
          );
        }
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

  private readonly apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
