import type { WebsocketAccessTokenRepositoryI } from "../domain/websocket-access-token-repository";
import { WebsocketAccessToken } from "../domain/websocket-access-token";
import { ErrorUnauthorizedForWebsocketConnection } from "../domain/error-unauthorized-for-websocket-connection";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { ApiClient } from "../../../plugins/api-client";

export class WebsocketAccessTokensRepositoryGirobet implements WebsocketAccessTokenRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

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
}
