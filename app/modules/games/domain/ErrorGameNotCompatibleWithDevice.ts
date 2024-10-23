import { CustomError } from "~/packages/result";

export class ErrorGameNotCompatibleWithDevice extends CustomError {
  override name = "ErrorGameNotCompatibleWithDevice" as const;

  public static new(userDevice: "mobile" | "desktop", metadata: Record<string, unknown>) {
    return new ErrorGameNotCompatibleWithDevice(userDevice, metadata);
  }

  private constructor(userDevice: "mobile" | "desktop", metadata: Record<string, unknown>) {
    super("This game is not compatible with the current user device", { ...metadata, userDevice });
  }
}
