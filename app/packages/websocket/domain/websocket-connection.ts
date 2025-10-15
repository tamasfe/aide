import type { Websocket } from "websocket-ts";
import type { ErrorEnteringWebsocketChannel } from "./error-entering-websocket-channel";
import type { WebsocketChannel, WebsocketOpenChannel } from "./websocket-channel";
import type { WebsocketMessagesByType, WebsocketMessagesToServer } from "./websocket-messages";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export type WebsocketEventListener = (websocket: Websocket, event: MessageEvent<string>) => void;

export interface WebsocketConnectionI {
  enterChannel(payload: {
    channel: "user";
    accessToken: string;
  } | {
    channel: WebsocketOpenChannel | "tracker";
  }): Promise<EmptyResult<ErrorEnteringWebsocketChannel>>;
  leaveChannel(channel: WebsocketChannel): Promise<EmptyResult<InfrastructureError>>;

  subscribe<T extends keyof WebsocketMessagesByType>(type: T, handler: (data: WebsocketMessagesByType[T]) => void): Result<WebsocketEventListener, InfrastructureError>;

  unsubscribe(listenerCallback: WebsocketEventListener): EmptyResult<InfrastructureError>;

  emit(message: WebsocketMessagesToServer): EmptyResult<InfrastructureError>;

  status: "connected" | "disconnected";
}
