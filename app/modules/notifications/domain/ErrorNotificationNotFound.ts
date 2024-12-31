import { CustomError } from "~/packages/result";

export class ErrorNotificationNotFound extends CustomError {
  override name = "ErrorNotificationNotFound" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorNotificationNotFound(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The notification was not found", metadata);
  }
}
