import type { ErrorEnteringWebsocketChannel } from "./error-entering-websocket-channel";
import type { WebsocketChannel, WebsocketOpenChannel } from "./websocket-channel";
import type { WebsocketMessagesByType, WebsocketMessagesToServer } from "./websocket-messages";
import type { EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface WebsocketConnectionI {
  enterChannel(payload: {
    channel: "user";
    accessToken: string;
  } | {
    channel: WebsocketOpenChannel | "tracker";
  }): Promise<EmptyResult<ErrorEnteringWebsocketChannel>>;
  leaveChannel(channel: WebsocketChannel): Promise<EmptyResult<InfrastructureError>>;

  subscribeToMessage<T extends keyof WebsocketMessagesByType>(type: T, handler: (data: WebsocketMessagesByType[T]) => void, subscriberId: string): EmptyResult<InfrastructureError>;
  unsubscribeFromMessage(subscriberId: string): EmptyResult<InfrastructureError>;

  emit(message: WebsocketMessagesToServer): EmptyResult<InfrastructureError>;

  status: "connected" | "disconnected";
}
