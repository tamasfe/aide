import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketAccessTokenRepositoryI } from "../../domain/websocket-access-token-repository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class WebsocketChannelManagerUser {
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

    const errorEnteringChannel = await wsConnection.enterChannel({
      channel: 'user',
      accessToken: wsAccessTokenResult.value.token
    });
    if(errorEnteringChannel.isFailure) {
      this.logger.error("Error logging in to the user WS channel when subscribing user channel", errorEnteringChannel.error, {connection: wsConnection});
      return
    }

    const resultSubscribingPayment = wsConnection.subscribeToMessage("payment_status_update", (message) => {
      this.asyncMessagePublisher.emit("girobet-backend:events:payments:payment-status-updated", {
        flowId: message.data.data.flow_id,
        status: message.data.data.status,
      });
    });
    if (resultSubscribingPayment.isFailure) {
      this.paymentStatusUpdateListenerId = null;
      this.logger.error("Error subscribing to the WS message when subscribing to user channel", resultSubscribingPayment.error, {message: 'payment_status_update', connection: wsConnection});
    } else {
      this.paymentStatusUpdateListenerId = resultSubscribingPayment.value;
    }

    const resultSubscribingKyc = wsConnection.subscribeToMessage("kyc_completed", () => {
      this.asyncMessagePublisher.emit("girobet-backend:events:kyc:kyc-process-completed", {});
    });
    if (resultSubscribingKyc.isFailure) {
      this.logger.error("Error subscribing to the WS message when subscribing to user channel", resultSubscribingKyc.error, {connection: wsConnection, message: 'kyc_completed'});
    }

    return;
  }

  public async unsubscribe(wsConnection: WebsocketConnectionI) {
    const errorUnsubscribing = await wsConnection.leaveChannel("user");
    if (errorUnsubscribing.isFailure) {
      this.logger.error("Error closing the user channel when unsubscribing from it", errorUnsubscribing.error, { connection: wsConnection });
      return;
    }

    if (this.paymentStatusUpdateListenerId) {
      const resultUnsubcribing = wsConnection.unsubscribeFromMessage(this.paymentStatusUpdateListenerId);
      if (resultUnsubcribing.isFailure) {
        this.logger.error("Error unsubscribing from the 'payment_status_update' message when unsubscribing from user channel", resultUnsubcribing.error, { connection: wsConnection, listenerId: this.paymentStatusUpdateListenerId });
        return;
      }
    }

    return;
  }

  private paymentStatusUpdateListenerId: number | null = null;
}
