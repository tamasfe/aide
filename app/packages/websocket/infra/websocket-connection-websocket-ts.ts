import { ExponentialBackoff, RingQueue, WebsocketBuilder, WebsocketEvent } from "websocket-ts";
import type { Websocket } from "websocket-ts";
import type { WebsocketChannel, WebsocketOpenChannel } from "../domain/websocket-channel";
import type { WebsocketConnectionI } from "../domain/websocket-connection";
import type { WebsocketMessagesByType, WebsocketMessagesFromServer, WebsocketMessagesToServer } from "../domain/websocket-messages";
import { ErrorEnteringWebsocketChannel } from "../domain/error-entering-websocket-channel";
import { fail, success, type EmptyResult } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class WebsocketConnectionTs implements WebsocketConnectionI {
  public static create(
    websocketConnectUrl: string,
    logger: LoggerI,
    asyncMessagePublisher: AsyncMessagePublisherI,
  ): WebsocketConnectionTs {
    return new WebsocketConnectionTs(websocketConnectUrl, logger, asyncMessagePublisher);
  }

  /**
   * For the "tracker" channel: the WS connection needs to have already entered the "user" channel. If not, the backend will return an error.
   */
  public async enterChannel(
    payload:
      | { channel: "user"; accessToken: string }
      | {
        channel: WebsocketOpenChannel | "tracker";
      },
  ): Promise<EmptyResult<ErrorEnteringWebsocketChannel>> {
    const listenerId = String(Date.now());
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

      if (payload.channel === "tracker") {
        const listenerToConfirmChannelEntering = (_i: Websocket, event: MessageEvent<string>) => {
          const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
          if (message.type === "protocol" && message.data === "tracker_entered") {
            return resolve(success());
          }
        };
        this.addListener(listenerToConfirmChannelEntering, listenerId);
        this.emit({ type: "tracker_enter" });
        return;
      }

      const listenerToConfirmChannelEntering = (_i: Websocket, event: MessageEvent<string>) => {
        const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
        if (message.type === "protocol" && typeof message.data === "object" && "ticker_entered" in message.data && message.data.ticker_entered.name === payload.channel) {
          return resolve(success());
        }
      };
      this.addListener(listenerToConfirmChannelEntering, listenerId);
      this.emit({
        type: "ticker_enter",
        data: {
          ticker_channel: payload.channel,
          replay_policy: "new", // This controls from which point on messages should be received. The handlers that subscribe to the channel should take into consideration if they are receiving all messages or only new ones.
        },
      });
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
        break;

      case "newest_wins":
        this.emit({ data: "newest_wins", type: "ticker_leave" });
        break;

      case "tracker":
        this.emit({ type: "tracker_leave" });
        break;
    }
    this.logger.debug("WS - Left channel", { channel });
    return success();
  }

  public subscribeToMessage<T extends keyof WebsocketMessagesByType>(
    type: T,
    listener: (data: WebsocketMessagesByType[T]) => void,
    listenerId: string,
  ) {
    const listenerWrapper = (_i: Websocket, event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data) as WebsocketMessagesFromServer;
        switch (type) {
          case "winning_now":
            if (typeof message.data === "object" && "type" in message.data && message.data.type === type) {
              listener(message as WebsocketMessagesByType[T]);
            }
            return;

          case "notification":
          case "balance_update":
          case "tracker":
            if (typeof message.data === "object" && "type" in message && message.type === type) {
              listener(message as WebsocketMessagesByType[T]);
            }
            return;

          default:
            throw new Error(`The message type: "${type}" has not been handled here yet`);
        }
      }
      catch (error) {
        this.logger.error(
          "WS - Failed to handle websocket message. This probably means the received message does not have the expected format and structure.",
          InfrastructureError.newFromUnknownError({ wsEvent: event }, error),
        );
      }
    };

    this.addListener(listenerWrapper, listenerId);
    this.logger.debug("WS - Subscribed to message", {
      message: type,
      listenerId,
    });
    return success();
  }

  public unsubscribeFromMessage(listenerId: string) {
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
            this.asyncMessagePublisher.emit("frontend:events:websockets:connection-state-changed", { state: "connected" });
          }
          this.status = "connected";
        }
      })
      .onClose((websocket, event) => {
        if (this.status !== "disconnected") {
          this.asyncMessagePublisher.emit("frontend:events:websockets:connection-state-changed", { state: "disconnected" });
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

  private addListener(listener: (_i: Websocket, event: MessageEvent<string>) => void, listenerId: string) {
    this.ws.addEventListener(WebsocketEvent.message, listener);
    this.messageListeners.set(listenerId, listener);
  }

  private removeListener(listenerId: string) {
    const listenerToRemove = this.messageListeners.get(listenerId);
    if (listenerToRemove) {
      this.ws.removeEventListener(WebsocketEvent.message, listenerToRemove);
      this.messageListeners.delete(listenerId);
    }
  }

  private messageListeners: Map<
    string,
    (_i: Websocket, event: MessageEvent<string>) => void
  > = new Map();
}
