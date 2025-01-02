import { ExponentialBackoff, RingQueue, WebsocketBuilder, WebsocketEvent } from "websocket-ts";
import type { Websocket } from "websocket-ts";
import type { WebsocketChannel } from "../domain/websocket-channel";
import type { WebsocketConnectionI } from "../domain/websocket-connection";
import type { WebsocketMessagesByType, WebsocketMessagesFromServer, WebsocketMessagesToServer } from "../domain/websocket-messages";
import { ErrorEnteringWebsocketChannel } from "../domain/error-entering-websocket-channel";
import { fail, success, type EmptyResult } from "~/packages/result";
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
  ): Promise<EmptyResult<ErrorEnteringWebsocketChannel>> {
    const listenerId = Date.now();
    const MAX_WAIT_MS = 1500;

    /**
     * The aim of this promise is to resolve...
     *  - either when the "channel successfully entered" message is received from the backend
     *  - either when the max timeout is reached
     */
    return new Promise<EmptyResult<ErrorEnteringWebsocketChannel>>((resolve) => {
      setTimeout(() => {
        resolve(fail(new ErrorEnteringWebsocketChannel(payload.channel)));
      }, MAX_WAIT_MS);

      if (payload.channel === "user") {
        const listenerToConfirmChannelEntering = (_i: Websocket, event: MessageEvent<string>) => {
          const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
          if (message.type === "protocol" && message.data === "login_complete") {
            return resolve(success());
          }
        };
        this.addListener(listenerToConfirmChannelEntering, listenerId);
        this.emit({ type: "user_login", data: payload.accessToken });
        return;
      }

      const listenerToConfirmChannelEntering = (_i: Websocket, event: MessageEvent<string>) => {
        const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
        if (message.type === "protocol" && typeof message.data === "object" && "channel_entered" in message.data && message.data.channel_entered === payload.channel) {
          return resolve(success());
        }
      };
      this.addListener(listenerToConfirmChannelEntering, listenerId);
      this.emit({ data: payload.channel, type: "channel_enter" });
    }).then((result) => {
      this.removeListener(listenerId);
      if (!result.isFailure) {
        this.logger.debug("WS - Entered channel", { channel: payload.channel });
      }
      return result;
    });
  }

  public async leaveChannel(
    channel: WebsocketChannel,
  ): Promise<EmptyResult<InfrastructureError>> {
    switch (channel) {
      case "user":
        this.emit({ type: "user_logout" });
        this.logger.debug("WS - Left channel", { channel });
        return success();

      case "newest_wins":
        this.emit({ data: "newest_wins", type: "channel_leave" });
        this.logger.debug("WS - Left channel", { channel });
        return success();
    }
  }

  public subscribeToMessage<T extends keyof WebsocketMessagesByType>(
    type: T,
    listener: (data: WebsocketMessagesByType[T]) => void,
  ) {
    const listenerWrapper = (_i: Websocket, event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
        switch (type) {
          case "winning_now":
          case "payment_status_update":
          case "kyc_completed":
            if (typeof message.data === "object" && "type" in message.data && message.data.type === type) {
              listener(message as WebsocketMessagesByType[T]);
            }
            return;

          case "channel_entered":
            if (typeof message.data === "object" && "channel_entered" in message.data) {
              listener(message as WebsocketMessagesByType[T]);
            }
            return;
        }
      }
      catch (error) {
        this.logger.error(
          "WS - Failed to handle websocket message. This probably means the received message does not have the expected format and structure.",
          InfrastructureError.newFromUnknownError({ wsEvent: event }, error),
        );
      }
    };

    const listenerId = this.addListener(listenerWrapper);
    this.logger.debug("WS - Subscribed to message", {
      message: type,
      listenerId,
    });
    return success(listenerId);
  }

  public unsubscribeFromMessage(listenerId: number) {
    this.removeListener(listenerId);
    this.logger.debug("WS - Unsubscribed from message", { listenerId });
    return success();
  }

  public emit(message: WebsocketMessagesToServer): EmptyResult<InfrastructureError> {
    this.ws.send(JSON.stringify(message));
    return success();
  }

  public status: "connected" | "disconnected" = "disconnected";

  private constructor(websocketConnectUrl: string, private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) {
    this.ws = new WebsocketBuilder(websocketConnectUrl)
      .onOpen((websocket, event) => {
        this.logger.debug("WS - Connection opened", { websocket, event });
      })
      .onMessage((_i: Websocket, event: MessageEvent<string>) => {
        const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
        if (message.type === "protocol" && message.data === "welcome") {
          if (this.status !== "connected") {
            this.asyncMessagePublisher.emit("girobet:events:websockets:connection-state-changed", { state: "connected" });
          }
          this.status = "connected";
        }
      })
      .onClose((websocket, event) => {
        if (this.status !== "disconnected") {
          this.asyncMessagePublisher.emit("girobet:events:websockets:connection-state-changed", { state: "disconnected" });
        }
        this.status = "disconnected";
        this.logger.debug("WS - Connection closed", { websocket, event });
      })
      .onReconnect((websocket, message) => {
        this.logger.debug("WS - Connection reconnected", { websocket, message });
      })
      .onError((websocket, event) =>
        this.logger.warn("WS - Connection closed because of error", { websocket, event }),
      )
      // .onMessage((websocket, message) =>
      //   this.logger.debug("WS - Message received", { websocket, message }),
      // )
      .withBackoff(new ExponentialBackoff(500, 8)) // 0.5s, 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s
      .withBuffer(new RingQueue(100))
      .build();
  }

  private ws: Websocket;

  private addListener(listener: (_i: Websocket, event: MessageEvent<string>) => void, listenerId = Date.now()): number {
    this.messageListeners.set(listenerId, listener);
    this.ws.addEventListener(WebsocketEvent.message, listener);
    return listenerId;
  }

  private removeListener(listenerId: number) {
    const listenerToRemove = this.messageListeners.get(listenerId);
    if (listenerToRemove) {
      this.ws.removeEventListener(WebsocketEvent.message, listenerToRemove);
    }
  }

  private messageListeners: Map<
    number,
    (_i: Websocket, event: MessageEvent<string>) => void
  > = new Map();
}
