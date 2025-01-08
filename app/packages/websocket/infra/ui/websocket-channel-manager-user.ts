import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketAccessTokenRepositoryI } from "../../domain/websocket-access-token-repository";
import type { WebsocketChannelI } from "./websocket-channel-interface";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class WebsocketChannelManagerUser implements WebsocketChannelI {
  constructor(
    private wsAccessTokenRepository: WebsocketAccessTokenRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
    private logger: LoggerI,
  ) {}

  public async subscribe(wsConnection: WebsocketConnectionI): Promise<void> {
    const wsAccessTokenResult = await this.wsAccessTokenRepository.create("user");
    if (wsAccessTokenResult.isFailure) {
      this.logger.error("Error finding websocket lease to be able to subscribe to user channel", wsAccessTokenResult.error, { connection: wsConnection });
      return;
    }

    const resultSubscribingAsyncMessages = wsConnection.subscribe((eventData) => {
      if (eventData.type === "balance_update") {
        this.asyncMessagePublisher.emit("girobet-backend:events:wallets:wallet-balance-updated", camelizeKeys(eventData.data));
      }

      if (eventData.type === "notification") {
        if (eventData.data.type === "payment_status_update") {
          this.asyncMessagePublisher.emit("girobet-backend:events:payments:payment-status-updated", camelizeKeys(eventData.data));
        }

        this.asyncMessagePublisher.emit("girobet-backend:events:backend-notification-received", { notification: {
          ...camelizeKeys(eventData).data,
          createdAt: new Date().toISOString(), // It would be better if this came from the Backend
        } });
      }
    });
    if (resultSubscribingAsyncMessages.isFailure) {
      this.logger.error("Error subscribing to the backend notification generic event when subscribing to user channel", resultSubscribingAsyncMessages.error, { connection: wsConnection, message: "kyc_completed" });
    }
    else {
      this.wslistenerId = resultSubscribingAsyncMessages.value;
    }

    const resultEnteringChannel = await wsConnection.enterChannel({
      channel: "user",
      accessToken: wsAccessTokenResult.value.token,
    });
    if (resultEnteringChannel.isFailure) {
      this.logger.error("Error logging in to the user WS channel", resultEnteringChannel.error, { connection: wsConnection });

      if (this.wslistenerId) {
        wsConnection.unsubscribeFromMessage(this.wslistenerId);
      }
      return;
    }

    return;
  }

  public async unsubscribe(wsConnection: WebsocketConnectionI) {
    const errorUnsubscribing = await wsConnection.leaveChannel("user");
    if (errorUnsubscribing.isFailure) {
      this.logger.error("Error closing the user channel when unsubscribing from it", errorUnsubscribing.error, { connection: wsConnection });
      return;
    }

    if (this.wslistenerId) {
      const resultUnsubcribing = wsConnection.unsubscribeFromMessage(this.wslistenerId);
      if (resultUnsubcribing.isFailure) {
        this.logger.error("Error unsubscribing when unsubscribing from user channel", resultUnsubcribing.error, { connection: wsConnection, listenerId: this.wslistenerId });
        return;
      }
    }

    return;
  }

  private wslistenerId: number | null = null;
}
