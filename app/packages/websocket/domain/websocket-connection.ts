import type { WebsocketChannel } from "./websocket-channel";
import type { WebsocketMessagesI } from "./websocket-messages";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface WebsocketConnectionI {
  enterChannel(payload: {
    channel: "user";
    accessToken: string;
  } | {
    channel: Exclude<WebsocketChannel, "user">;
  }): Promise<EmptyResult<InfrastructureError>>;
  leaveChannel(channel: WebsocketChannel): Promise<EmptyResult<InfrastructureError>>;

  subscribeToMessage<T extends keyof WebsocketMessagesI>(type: T, handler: (data: WebsocketMessagesI[T]) => void): Result<number, InfrastructureError>;
  unsubscribeFromMessage(handlerId: number): EmptyResult<InfrastructureError>;
}
