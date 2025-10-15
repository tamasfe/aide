import type { CustomError, EmptyResult, Result } from "~/packages/result";
import type { ErrorEnteringWebsocketChannel } from "./error-entering-websocket-channel";
import type { WebsocketConnectionI, WebsocketEventListener } from "./websocket-connection";
import type { ErrorUnauthorizedForWebsocketConnection } from "./error-unauthorized-for-websocket-connection";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WebsocketTickerMessagesByType } from "./websocket-messages";

export interface WebsocketTickerChannelManagerI {
  subscribe<T extends keyof WebsocketTickerMessagesByType>(
    wsConnection: WebsocketConnectionI,
    message: T,
    callback: (message: WebsocketTickerMessagesByType[T]) => void):
  Promise<Result<WebsocketEventListener, ErrorEnteringWebsocketChannel | InfrastructureError | ErrorUnauthorizedForWebsocketConnection>>;

  unsubscribe(wsConnection: WebsocketConnectionI, callback: WebsocketEventListener): Promise<EmptyResult<CustomError>>;
}
