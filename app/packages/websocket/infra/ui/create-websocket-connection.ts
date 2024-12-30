import { fail, success, type Result } from "~/packages/result";
import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { WebsocketConnectionWebsocketTs } from "../websocket-connection-websocket-ts";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class CreateWebsocketConnection {
  constructor(private websocketConnectUrl: string, private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) { }

  public async handle(): Promise<Result<WebsocketConnectionI, InfrastructureError>> {
    try {
      return success(
        WebsocketConnectionWebsocketTs.create(
          this.websocketConnectUrl,
          this.logger,
          this.asyncMessagePublisher,
        )
      );
    } catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }
}
