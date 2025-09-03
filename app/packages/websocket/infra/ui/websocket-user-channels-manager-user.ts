import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import type { WebsocketAccessTokenRepositoryI } from "../../domain/websocket-access-token-repository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { fail, success } from "~/packages/result";
import { ErrorWebsocketChannelNotEntered } from "../../domain/error-websocket-channel-not-entered";
import type { WebsocketUserMessagesByType } from "../../domain/websocket-messages";
import type { WebsocketUserChannelsManagerI } from "../../domain/websocket-user-channels-manager";

export class WebsocketUserChannelsManager implements WebsocketUserChannelsManagerI {
  constructor(
    private wsAccessTokenRepository: WebsocketAccessTokenRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
    private logger: LoggerI,
  ) {}

  public async enterChannels(wsConnection: WebsocketConnectionI) {
    const resultEnteringUserChannel = await this.enterUserChannel(wsConnection);
    if (resultEnteringUserChannel.isFailure) {
      return resultEnteringUserChannel;
    }

    const resultEnteringTrackerChannel = await this.enterTrackerChannel(wsConnection);
    if (resultEnteringTrackerChannel.isFailure) {
      return resultEnteringTrackerChannel;
    }

    return success();
  }

  public async leaveChannels(wsConnection: WebsocketConnectionI) {
    if (this.channelsEntered.user) {
      const resultLeavingChannel = await wsConnection.leaveChannel("user");
      if (resultLeavingChannel.isFailure) {
        this.logger.error("Error leaving the WS channel", resultLeavingChannel.error, { channel: "user", connection: wsConnection });
        return resultLeavingChannel;
      }
    }

    if (this.channelsEntered.tracker) {
      const resultLeavingChannel = await wsConnection.leaveChannel("tracker");
      if (resultLeavingChannel.isFailure) {
        this.logger.error("Error leaving the WS channel", resultLeavingChannel.error, { channel: "tracker", connection: wsConnection });
        return resultLeavingChannel;
      }
    }

    return success();
  }

  public async subscribe<T extends keyof WebsocketUserMessagesByType>(wsConnection: WebsocketConnectionI, subscriber: {
    message: T;
    callback: (message: WebsocketUserMessagesByType[T]) => void;
    id: string;
  }) {
    if (!this.channelsEntered.user) {
      return fail(new ErrorWebsocketChannelNotEntered("user"));
    }
    if (!this.channelsEntered.tracker) {
      return fail(new ErrorWebsocketChannelNotEntered("tracker"));
    }

    const resultSubscribing = wsConnection.subscribeToMessage(subscriber.message, subscriber.callback, subscriber.id);
    if (resultSubscribing.isFailure) {
      return resultSubscribing;
    }

    return success();
  }

  public async unsubscribe(wsConnection: WebsocketConnectionI, subscriberId: string) {
    return wsConnection.unsubscribeFromMessage(subscriberId);
  }

  /**
   *
   *
   * Private
   *
   *
   */

  private async enterUserChannel(wsConnection: WebsocketConnectionI) {
    if (this.channelsEntered.user) {
      return success(); // Already in the channel
    }

    const wsAccessTokenResult = await this.wsAccessTokenRepository.create("user");
    if (wsAccessTokenResult.isFailure) {
      this.logger.error("Error finding websocket access token to be able to enter the user channel", wsAccessTokenResult.error, { connection: wsConnection });
      return wsAccessTokenResult;
    }

    const resultEnteringChannel = await wsConnection.enterChannel({ channel: "user", accessToken: wsAccessTokenResult.value.token });
    if (resultEnteringChannel.isFailure) {
      this.logger.error("Error entering the WS channel", resultEnteringChannel.error, { channel: "user", connection: wsConnection });
      return resultEnteringChannel;
    }

    this.channelsEntered.user = true;
    return success();
  }

  private async enterTrackerChannel(wsConnection: WebsocketConnectionI) {
    if (this.channelsEntered.tracker) {
      return success(); // Already in the channel
    }

    if (this.channelsEntered.user === false) {
      return fail(new ErrorWebsocketChannelNotEntered("user"));
    }

    const resultEnteringChannel = await wsConnection.enterChannel({ channel: "tracker" });
    if (resultEnteringChannel.isFailure) {
      this.logger.error("Error entering the WS channel", resultEnteringChannel.error, { channel: "tracker", connection: wsConnection });
      return resultEnteringChannel;
    }

    this.channelsEntered.tracker = true;
    return success();
  }

  private channelsEntered = {
    user: false,
    tracker: false,
  };
}
