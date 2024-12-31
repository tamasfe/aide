import { AbstractExtendedError } from "~/packages/result";

export class ErrorSavingNotification extends AbstractExtendedError {
  override name = "ErrorSavingNotification" as const;

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorSavingNotification(
      "Error saving notification",
      metadata,
      ErrorSavingNotification.parseCause(unknownError),
    );
  }

  public static newFromError(metadata: Record<string, unknown>, error: Error) {
    return new ErrorSavingNotification(
      "Error saving notification. More information in the cause",
      metadata,
      ErrorSavingNotification.parseCause(error),
    );
  }
}
