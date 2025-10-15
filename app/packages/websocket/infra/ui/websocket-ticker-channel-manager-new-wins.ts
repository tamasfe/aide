import type { WebsocketTickerChannelManagerI } from "../../domain/websocket-ticker-channel-manager";
import type { WebsocketTickerMessagesByType } from "../../domain/websocket-messages";
import type { LoggerI } from "~/packages/logger/Logger";
import { success } from "~/packages/result";
import type { WebsocketConnectionI, WebsocketEventListener } from "../../domain/websocket-connection";

export class WebsocketTickerChannelManagerNewWins implements WebsocketTickerChannelManagerI {
  channel = "newest_wins" as const;

  constructor(
    private logger: LoggerI,
  ) {}

  /**
   * If no subscribers exist for this channel, first enters the channel.
   * Then subscribes the handler to the specific message.
   * This method is idempotent. If already subscribed: does nothing.
   */
  public async subscribe<T extends keyof WebsocketTickerMessagesByType>(
    wsConnection: WebsocketConnectionI,
    message: T,
    callback: (message: WebsocketTickerMessagesByType[T]) => void,
  ) {
    const resultEnteringChannel = await this.enterChannel(wsConnection);

    if (resultEnteringChannel.isFailure) {
      return resultEnteringChannel;
    }

    return wsConnection.subscribe(message, callback);
  }

  /**
   * Unsubscribes the subscriber
   * If no subscribers remain for this channel, then leaves the channel.
   * This method is idempotent. If already unsubscribed: does nothing.
   */
  public async unsubscribe(wsConnection: WebsocketConnectionI, callback: WebsocketEventListener) {
    const resultUnsubcribing = wsConnection.unsubscribe(callback);
    if (resultUnsubcribing.isFailure) {
      return resultUnsubcribing;
    }

    return this.leaveChannelIfNoMoreSubscribers(wsConnection);
  }

  private hasEnteredChannel: boolean = false;

  private async enterChannel(wsConnection: WebsocketConnectionI) {
    if (this.hasEnteredChannel) {
      return success();
    }

    this.hasEnteredChannel = true; // We set it here to avoid race conditions of two components calling it super fast and entering more than once at the same time

    const resultEnteringChannel = await wsConnection.enterChannel({ channel: this.channel });
    if (resultEnteringChannel.isFailure) {
      this.hasEnteredChannel = false;
      this.logger.error("Error entering the WS channel", resultEnteringChannel.error, { channel: this.channel, connection: wsConnection });
      return resultEnteringChannel;
    }

    return success();
  }

  private async leaveChannelIfNoMoreSubscribers(wsConnection: WebsocketConnectionI) {
    if (!this.hasEnteredChannel) {
      return success();
    }

    this.hasEnteredChannel = false; // We set it here to avoid race conditions of two components calling it super fast and attempting to leave more than once at the same time

    const resultLeavingChannel = await wsConnection.leaveChannel(this.channel);
    if (resultLeavingChannel.isFailure) {
      this.hasEnteredChannel = true;
      this.logger.error("Error leaving the WS channel", resultLeavingChannel.error, { channel: this.channel, connection: wsConnection });
      return resultLeavingChannel;
    }

    this.hasEnteredChannel = false;

    return success();
  }
}
