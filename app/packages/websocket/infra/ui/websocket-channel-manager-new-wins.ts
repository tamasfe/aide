import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketMessagesI } from "../../domain/websocket-messages";
import type { LoggerI } from "~/packages/logger/Logger";

export class WebsocketChannelManagerNewWins {
  constructor(private logger: LoggerI) {}

  public async subscribe(wsConnection: WebsocketConnectionI, callback: (message: WebsocketMessagesI["winning_now"]) => void): Promise<void> {
    const subscribeResult = wsConnection.subscribeToMessage("winning_now", callback);
    if (subscribeResult.isFailure) {
      this.logger.error("Error subscribing to the 'new_wins' message when subscribing to newest wins channel", subscribeResult.error, { connection: wsConnection });
      return;
    }
    this.listenerId = subscribeResult.value;

    const resultEnteringChannel = await wsConnection.enterChannel({ channel: "newest_wins" });
    if (resultEnteringChannel.isFailure) {
      this.logger.error("Error entering the WS newest wins channel", resultEnteringChannel.error, { connection: wsConnection });
      return;
    }
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
  }

  private listenerId: number | null = null;
}
