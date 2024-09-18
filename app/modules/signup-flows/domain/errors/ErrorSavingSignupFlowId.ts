import { AbstractExtendedError } from "~/packages/result";

export class ErrorSavingSignupFlowId extends AbstractExtendedError {
  override name = "ErrorSavingSignupFlowId" as const;

  public newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorSavingSignupFlowId(
      "Error saving signup flow id",
      metadata,
      ErrorSavingSignupFlowId.parseCause(unknownError),
    );
  }
}
