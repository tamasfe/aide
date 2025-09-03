import { CustomError } from "~/packages/result";

export class ErrorUnauthorizedForWebsocketConnection extends CustomError {
  public readonly name = "ErrorUnauthorizedForWebsocketConnection" as const;
  constructor() {
    super("Unauthorized access to the Websocket connection");
  }
}
