import type { WebsocketConnectionI } from "../../domain/websocket-connection";
import { WebsocketConnectionTs } from "../websocket-connection-websocket-ts";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";
import type { NuxtApp } from "#app";

const WS_CONNECT_PATH = "/ws/connect";

export class CreateWebsocketConnection {
  constructor(
    private websocketConnectBaseUrl: string,
    private logger: LoggerI,
    private nuxtApp: NuxtApp,
  ) { }

  public async handle(): Promise<Result<WebsocketConnectionI, InfrastructureError>> {
    try {
      const websocketConnectUrl = new URL(WS_CONNECT_PATH, this.websocketConnectBaseUrl).toString();
      return success(
        WebsocketConnectionTs.create(
          websocketConnectUrl,
          this.logger,
          this.nuxtApp,
        ),
      );
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }
}
