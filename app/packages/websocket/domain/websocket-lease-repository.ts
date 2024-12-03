import type { ErrorUnauthorizedForWebsocketConnection } from "./error-unauthorized-for-websocket-connection";
import type { WebsocketChannel } from "./websocket-channel";
import type { WebsocketLease } from "./websocket-lease";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface WebsocketLeaseRepositoryI {
  find(channel: WebsocketChannel): Promise<Result<WebsocketLease, ErrorUnauthorizedForWebsocketConnection | InfrastructureError>>;
}
