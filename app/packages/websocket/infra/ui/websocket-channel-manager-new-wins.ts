import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketMessagesByType } from "../../domain/websocket-messages";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";

export class WebsocketChannelManagerNewWins {
  constructor(private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async subscribe(wsConnection: WebsocketConnectionI, callback: (message: WebsocketMessagesByType["winning_now"]) => void): Promise<void> {
    const handler = async (wsConnection: WebsocketConnectionI, callback: (message: WebsocketMessagesByType["winning_now"]) => void) => {
      const subscribeResult = wsConnection.subscribeToMessage("winning_now", callback);
      if (subscribeResult.isFailure) {
        this.logger.error("Error subscribing to the 'new_wins' message when subscribing to newest wins channel", subscribeResult.error, { connection: wsConnection });
        return;
      }
      this.listenerId = subscribeResult.value;

      const resultEnteringChannel = await wsConnection.enterChannel({ channel: "newest_wins" });
      if (resultEnteringChannel.isFailure) {
        this.logger.error("Error entering the WS newest wins channel", resultEnteringChannel.error, { connection: wsConnection });
        if (this.listenerId) {
          wsConnection.unsubscribeFromMessage(this.listenerId);
        }
        return;
      }
    };

    await handler(wsConnection, callback);

    this.eventListenerId = this.asyncMessagePublisher.subscribe("girobet:events:websockets:connection-state-changed", async (message) => {
      if (message.state === "connected") {
        await handler(wsConnection, callback);
      }
    });
  }

  public async unsubscribe(wsConnection: WebsocketConnectionI) {
    const errorUnsubscribing = await wsConnection.leaveChannel("newest_wins");
    if (errorUnsubscribing.isFailure) {
      this.logger.error("Error closing the newest_wins channel when unsubscribing from it", errorUnsubscribing.error, { connection: wsConnection });
      return;
    }

    if (this.listenerId) {
      const resultUnsubcribing = wsConnection.unsubscribeFromMessage(this.listenerId);
      if (resultUnsubcribing.isFailure) {
        this.logger.error("Error unsubscribing from the 'newest_wins' message when unsubscribing from user channel", resultUnsubcribing.error, { connection: wsConnection, listenerId: this.listenerId });
        return;
      }
    }

    if (this.eventListenerId) {
      this.asyncMessagePublisher.unsubscribe(this.eventListenerId);
    }
  }

  private listenerId: number | null = null;
  private eventListenerId: number | null = null;
}
