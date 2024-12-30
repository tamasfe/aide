import type { ErrorUnauthorizedForWebsocketConnection } from "./error-unauthorized-for-websocket-connection";
import type { WebsocketAccessToken } from "./websocket-access-token";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface WebsocketAccessTokenRepositoryI {
  create(channel: 'user'): Promise<Result<WebsocketAccessToken, ErrorUnauthorizedForWebsocketConnection | InfrastructureError>>;
}
