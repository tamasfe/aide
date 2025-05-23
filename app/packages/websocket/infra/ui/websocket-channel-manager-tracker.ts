import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketMessagesByType } from "../../domain/websocket-messages";
import type { WebsocketChannelI } from "./websocket-channel-interface";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";

export class WebsocketChannelManagerTracker implements WebsocketChannelI<WebsocketMessagesByType["tracker"]> {
  constructor(private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async subscribe(wsConnection: WebsocketConnectionI, callback: (message: WebsocketMessagesByType["tracker"]) => void): Promise<void> {
    const handler = async (wsConnection: WebsocketConnectionI, callback: (message: WebsocketMessagesByType["tracker"]) => void) => {
      const subscribeResult = wsConnection.subscribeToMessage("tracker", callback);
      if (subscribeResult.isFailure) {
        this.logger.error("Error subscribing to the 'tracker' message when subscribing to newest wins channel", subscribeResult.error, { connection: wsConnection });
        return;
      }
      this.listenerId = subscribeResult.value;

      const resultEnteringChannel = await wsConnection.enterChannel({ channel: "tracker" });
      if (resultEnteringChannel.isFailure) {
        this.logger.error("Error entering the WS newest wins channel", resultEnteringChannel.error, { connection: wsConnection });
        if (this.listenerId) {
          wsConnection.unsubscribeFromMessage(this.listenerId);
        }
        return;
      }
    };

    await handler(wsConnection, callback);

    this.eventListenerId = this.asyncMessagePublisher.subscribe("frontend:events:websockets:connection-state-changed", async (message) => {
      if (message.state === "connected") {
        await handler(wsConnection, callback);
      }
    });
  }

  public async unsubscribe(wsConnection: WebsocketConnectionI) {
    const errorUnsubscribing = await wsConnection.leaveChannel("tracker");
    if (errorUnsubscribing.isFailure) {
      this.logger.error("Error closing the tracker channel when unsubscribing from it", errorUnsubscribing.error, { connection: wsConnection });
      return;
    }

    if (this.listenerId) {
      const resultUnsubcribing = wsConnection.unsubscribeFromMessage(this.listenerId);
      if (resultUnsubcribing.isFailure) {
        this.logger.error("Error unsubscribing from the 'tracker' message when unsubscribing from user channel", resultUnsubcribing.error, { connection: wsConnection, listenerId: this.listenerId });
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
