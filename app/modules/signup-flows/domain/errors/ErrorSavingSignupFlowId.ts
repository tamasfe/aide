import { AbstractExtendedError } from "~/packages/result";

export class ErrorSavingSignupFlowId extends AbstractExtendedError {
  override name = "ErrorSavingSignupFlowId" as const;

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorSavingSignupFlowId(
      "Error saving signup flow id",
      metadata,
      ErrorSavingSignupFlowId.parseCause(unknownError),
    );
  }

  public static newFromError(metadata: Record<string, unknown>, error: Error) {
    return new ErrorSavingSignupFlowId(
      "Error saving signup flow id. More information in the cause",
      metadata,
      ErrorSavingSignupFlowId.parseCause(error),
    );
  }
}
