import { fail, success, type Result } from "~/packages/result";
import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { WebsocketConnectionWebsocketTs } from "../websocket-connection-websocket-ts";
import type { LoggerI } from "~/packages/logger/Logger";

export class CreateWebsocketConnection {
  constructor(private logger: LoggerI, private websocketConnectUrl: string) { }

  public async handle(): Promise<Result<WebsocketConnectionI, InfrastructureError>> {
    try {
      return success(
        WebsocketConnectionWebsocketTs.create(
          this.logger,
          this.websocketConnectUrl
        )
      );
    } catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }
}
