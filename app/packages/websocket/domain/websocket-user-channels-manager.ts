import type { CustomError, EmptyResult } from "~/packages/result";
import type { ErrorEnteringWebsocketChannel } from "./error-entering-websocket-channel";
import type { ErrorWebsocketChannelNotEntered } from "./error-websocket-channel-not-entered";
import type { WebsocketConnectionI } from "./websocket-connection";
import type { ErrorUnauthorizedForWebsocketConnection } from "./error-unauthorized-for-websocket-connection";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WebsocketUserMessagesByType } from "./websocket-messages";

export interface WebsocketUserChannelsManagerI {
  /**
   * Enters all user-related channels at the same time, to abstract from the frontend which message-types are relevant for each channel.
   */
  enterChannels(wsConnection: WebsocketConnectionI): Promise<EmptyResult<ErrorEnteringWebsocketChannel | ErrorWebsocketChannelNotEntered | InfrastructureError | ErrorUnauthorizedForWebsocketConnection>>;

  /**
   * Leaves all user-related channels.
   */
  leaveChannels(wsConnection: WebsocketConnectionI): Promise<EmptyResult<InfrastructureError>>;

  subscribe<T extends keyof WebsocketUserMessagesByType>(wsConnection: WebsocketConnectionI, subscriber: {
    id: string;
    message: T;
    callback: (message: WebsocketUserMessagesByType[T]) => void;
  }): Promise<EmptyResult<ErrorWebsocketChannelNotEntered | ErrorUnauthorizedForWebsocketConnection | InfrastructureError>>;

  unsubscribe(wsConnection: WebsocketConnectionI, subscriptionId: string): Promise<EmptyResult<CustomError>>;
}
