import { WebsocketBuilder } from "websocket-ts";
import type { WebsocketLeaseRepositoryI } from "../../domain/websocket-lease-repository";
import type { WebsocketChannel } from "../../domain/websocket-channel";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class AttemptOpeningWebsocket {
  constructor(
    private readonly websocketConnectUrl: string,
    private readonly websocketLeaseRepo: WebsocketLeaseRepositoryI,
    private readonly logger: LoggerI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(channel: WebsocketChannel) {
    const websocketLeaseResult = await this.websocketLeaseRepo.find(channel);
    if (websocketLeaseResult.isFailure) {
      if (websocketLeaseResult.error.name === "ErrorUnauthorizedForWebsocketConnection") {
        return null;
      }

      this.logger.error("Failed to find websocket lease", websocketLeaseResult.error);
      return null;
    }

    /** More info at https://github.com/jjxxs/websocket-ts */
    return new WebsocketBuilder(this.websocketConnectUrl)
      .withProtocols([`Authorization`, websocketLeaseResult.value.token])
      .onOpen((websocket, event) => this.logger.debug("WS connection opened", { websocket, event }))
      .onClose((websocket, event) => this.logger.debug("WS connection closed", { websocket, event }))
      .onError((websocket, event) => {
        this.logger.warn("WS connection closed because of error", { websocket, event });
        this.asyncMessagePublisher.emit("girobet:events:websockets:connection-errored", { channel });
      })
      .onMessage((websocket, message) => this.logger.debug("WS message received", { websocket, message }))
      .build();
  }
}
