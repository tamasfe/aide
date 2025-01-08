import type { WebsocketConnectionI } from "../../domain/websocket-connection";

export interface WebsocketChannelI<MessageType = null> {

  subscribe(wsConnection: WebsocketConnectionI, callback?: (message: MessageType) => void): Promise<void>;

  unsubscribe(wsConnection: WebsocketConnectionI): Promise<void>;

}
