import type { CustomError, EmptyResult } from "~/packages/result";
import type { ErrorEnteringWebsocketChannel } from "./error-entering-websocket-channel";
import type { WebsocketConnectionI } from "./websocket-connection";
import type { ErrorUnauthorizedForWebsocketConnection } from "./error-unauthorized-for-websocket-connection";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WebsocketTickerMessagesByType } from "./websocket-messages";

export interface WebsocketTickerChannelManagerI {
  subscribe<T extends keyof WebsocketTickerMessagesByType>(wsConnection: WebsocketConnectionI, subscriber: {
    id: string;
    message: T;
    callback: (message: WebsocketTickerMessagesByType[T]) => void;
  }): Promise<EmptyResult<ErrorEnteringWebsocketChannel | InfrastructureError | ErrorUnauthorizedForWebsocketConnection>>;

  unsubscribe(wsConnection: WebsocketConnectionI, subscriptionId: string): Promise<EmptyResult<CustomError>>;
}
