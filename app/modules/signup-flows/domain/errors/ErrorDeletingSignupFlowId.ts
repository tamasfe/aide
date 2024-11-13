import { AbstractExtendedError } from "~/packages/result";

export class ErrorDeletingSignupFlowId extends AbstractExtendedError {
  override name = "ErrorDeletingSignupFlowId" as const;

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorDeletingSignupFlowId(
      "Error deleting signup flow id",
      metadata,
      ErrorDeletingSignupFlowId.parseCause(unknownError),
    );
  }

  public static newFromError(metadata: Record<string, unknown>, error: Error) {
    return new ErrorDeletingSignupFlowId(
      "Error deleting signup flow id. More information in the cause",
      metadata,
      ErrorDeletingSignupFlowId.parseCause(error),
    );
  }
}
