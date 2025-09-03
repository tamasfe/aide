import type { WebsocketTickerChannelManagerI } from "../../domain/websocket-ticker-channel-manager";
import type { WebsocketTickerMessagesByType } from "../../domain/websocket-messages";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import { success } from "~/packages/result";
import type { WebsocketConnectionI } from "../../domain/websocket-connection";

export class WebsocketTickerChannelManagerNewWins implements WebsocketTickerChannelManagerI {
  channel = "newest_wins" as const;

  constructor(
    private logger: LoggerI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  /**
   * If no subscribers exist for this channel, first enters the channel.
   * Then subscribes the handler to the specific message
   */
  public async subscribe<T extends keyof WebsocketTickerMessagesByType>(wsConnection: WebsocketConnectionI, subscriber: {
    message: T;
    callback: (message: WebsocketTickerMessagesByType[T]) => void;
    id: string;
  }) {
    const resultEnteringChannel = await this.enterChannel(wsConnection);
    if (resultEnteringChannel.isFailure) {
      return resultEnteringChannel;
    }

    const resultSubscribing = wsConnection.subscribeToMessage(subscriber.message, subscriber.callback, subscriber.id);
    if (resultSubscribing.isFailure) {
      return resultSubscribing;
    }

    this.subscriberIds.add(subscriber.id);
    return success();

    // this.eventListenerId = this.asyncMessagePublisher.subscribe("frontend:events:websockets:connection-state-changed", async (message) => {
    //   if (message.state === "connected") {
    //     await handler(wsConnection, callback);
    //   }
    // });
  }

  /**
   * Unsubscribes the subscriber
   * If no subscribers remain for this channel, then leaves the channel.
   */
  public async unsubscribe(wsConnection: WebsocketConnectionI, subscriberId: string) {
    const resultUnsubcribing = wsConnection.unsubscribeFromMessage(subscriberId);
    if (resultUnsubcribing.isFailure) {
      return resultUnsubcribing;
    }

    this.subscriberIds.delete(subscriberId);

    return this.leaveChannelIfNoMoreSubscribers(wsConnection);
  }

  private subscriberIds: Set<string> = new Set();

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

    if (this.subscriberIds.size > 0) {
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
