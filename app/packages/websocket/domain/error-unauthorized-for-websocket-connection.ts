import { CustomError } from "~/packages/result";

export class ErrorUnauthorizedForWebsocketConnection extends CustomError {
  public readonly name = "ErrorUnauthorizedForWebsocketConnection";
  constructor() {
    super("Unauthorized access to the Websocket connection");
  }
}
