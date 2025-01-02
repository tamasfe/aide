import { CustomError } from "~/packages/result";

export class ErrorEnteringWebsocketChannel extends CustomError {
  public name = "ErrorEnteringWebsocketChannel" as const;

  public constructor(channel: string) {
    super("Websocket channel could not be entered", { channel });
  }
}
