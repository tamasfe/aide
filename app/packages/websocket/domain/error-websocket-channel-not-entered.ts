import { CustomError } from "~/packages/result";

export class ErrorWebsocketChannelNotEntered extends CustomError {
  override name = "ErrorWebsocketChannelNotEntered" as const;

  constructor(channel: string) {
    super("The WS channel has not been entered yet", {
      channel,
    });
  }
}
