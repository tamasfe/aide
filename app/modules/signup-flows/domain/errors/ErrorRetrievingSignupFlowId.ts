import { AbstractExtendedError } from "~/packages/result";

export class ErrorRetrievingSignupFlowId extends AbstractExtendedError {
  override name = "ErrorRetrievingSignupFlowId" as const;

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorRetrievingSignupFlowId(
      "Error retrieving signup flow id",
      metadata,
      ErrorRetrievingSignupFlowId.parseCause(unknownError),
    );
  }

  public static newFromError(metadata: Record<string, unknown>, error: Error) {
    return new ErrorRetrievingSignupFlowId(
      "Error retrieving signup flow id. More information in the cause",
      metadata,
      ErrorRetrievingSignupFlowId.parseCause(error),
    );
  }
}
