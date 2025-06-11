import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import { WebsocketConnectionWebsocketTs } from "../websocket-connection-websocket-ts";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

const WS_CONNECT_PATH = "/ws/connect";

export class CreateWebsocketConnection {
  constructor(private websocketConnectBaseUrl: string, private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI) { }

  public async handle(): Promise<Result<WebsocketConnectionI, InfrastructureError>> {
    try {
      const websocketConnectUrl = new URL(WS_CONNECT_PATH, this.websocketConnectBaseUrl).toString();
      return success(
        WebsocketConnectionWebsocketTs.create(
          websocketConnectUrl,
          this.logger,
          this.asyncMessagePublisher,
        ),
      );
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }
}
