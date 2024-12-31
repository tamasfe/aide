import { AbstractExtendedError } from "~/packages/result";

export class ErrorRetrievingNotifications extends AbstractExtendedError {
  override name = "ErrorRetrievingNotifications" as const;

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorRetrievingNotifications(
      "Error retrieving notifications",
      metadata,
      ErrorRetrievingNotifications.parseCause(unknownError),
    );
  }

  public static newFromError(metadata: Record<string, unknown>, error: Error) {
    return new ErrorRetrievingNotifications(
      "Error retrieving notifications. More information in the cause",
      metadata,
      ErrorRetrievingNotifications.parseCause(error),
    );
  }
}
