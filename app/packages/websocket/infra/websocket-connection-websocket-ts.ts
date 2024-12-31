import { ExponentialBackoff, WebsocketBuilder, WebsocketEvent } from "websocket-ts";
import type { Websocket } from "websocket-ts";
import type { WebsocketChannel } from "../domain/websocket-channel";
import type { WebsocketConnectionI } from "../domain/websocket-connection";
import type { WebsocketMessagesI } from "../domain/websocket-messages";
import { success, type EmptyResult } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class WebsocketConnectionWebsocketTs implements WebsocketConnectionI {
  public static create(
    websocketConnectUrl: string,
    logger: LoggerI,
    asyncMessagePublisher: AsyncMessagePublisherI,
  ): WebsocketConnectionWebsocketTs {
    return new WebsocketConnectionWebsocketTs(websocketConnectUrl, logger, asyncMessagePublisher);
  }

  public async enterChannel(
    payload:
      | { channel: "user"; accessToken: string }
      | { channel: Exclude<WebsocketChannel, "user"> },
  ): Promise<EmptyResult<InfrastructureError>> {
    switch (payload.channel) {
      case "user":
        this.ws.send(JSON.stringify({ data: payload.accessToken, type: "user_login" }));
        this.logger.debug("Entered WS channel", { channel: payload.channel });
        return success();

      case "newest_wins":
        this.ws.send(JSON.stringify({ data: "newest_wins", type: "channel_enter" }));
        this.logger.debug("Entered WS channel", { channel: payload.channel });
        return success();
    }
  }

  public async leaveChannel(
    channel: WebsocketChannel,
  ): Promise<EmptyResult<InfrastructureError>> {
    switch (channel) {
      case "user":
        this.ws.send(JSON.stringify({ type: "user_logout" }));
        this.logger.debug("Left WS channel", { channel });
        return success();

      case "newest_wins":
        this.ws.send(JSON.stringify({ data: "newest_wins", type: "channel_leave" }));
        this.logger.debug("Left WS channel", { channel });
        return success();
    }
  }

  public subscribeToMessage<T extends keyof WebsocketMessagesI>(
    type: T,
    listener: (data: WebsocketMessagesI[T]) => void,
  ) {
    const listenerWrapper = (_i: Websocket, event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as WebsocketMessagesI[T];
        if (data.data?.type === type) {
          listener(data);
        }
        return;
      }
      catch (error) {
        this.logger.error(
          "Failed to handle websocket message. This probably means the received message does not have the expected format and structure.",
          InfrastructureError.newFromUnknownError({ wsEvent: event }, error),
        );
      }
    };

    this.ws.addEventListener(WebsocketEvent.message, listenerWrapper);

    const listenerId = Date.now();
    this.messageListeners.set(listenerId, listenerWrapper);

    this.logger.debug("Subscribed to websocket message", {
      message: type,
      listenerId,
    });
    return success(listenerId);
  }

  public unsubscribeFromMessage(listenerId: number) {
    const listenerToRemove = this.messageListeners.get(listenerId);
    if (!listenerToRemove) {
      return success();
    }

    this.ws.removeEventListener(WebsocketEvent.message, listenerToRemove);

    this.logger.debug("Unsubscribed from websocket message", { listenerId });
    return success();
  }

  private constructor(websocketConnectUrl: string, private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) {
    this.ws = new WebsocketBuilder(websocketConnectUrl)
      .onOpen((websocket, event) => {
        if (this.connectionState !== "connected") {
          this.asyncMessagePublisher.emit("girobet:events:websockets:connection-state-changed", { state: "connected" });
        }
        this.logger.debug("WS connection opened", { websocket, event });
      })
      .onClose((websocket, event) => {
        if (this.connectionState !== "disconnected") {
          this.asyncMessagePublisher.emit("girobet:events:websockets:connection-state-changed", { state: "disconnected" });
        }
        this.logger.debug("WS connection closed", { websocket, event });
      })
      .onReconnect((websocket, message) => {
        this.logger.debug("WS connection reconnected", { websocket, message });
      })
      .onError((websocket, event) =>
        this.logger.warn("WS connection closed because of error", { websocket, event }),
      )
      .onMessage((websocket, message) =>
        this.logger.debug("WS message received", { websocket, message }),
      )
      .withBackoff(new ExponentialBackoff(500, 8)) // 0.5s, 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s
      .build();
  }

  private ws: Websocket;
  private messageListeners: Map<
    number,
    (_i: Websocket, event: MessageEvent<string>) => void
  > = new Map();

  private connectionState: "connected" | "disconnected" = "disconnected";
}
