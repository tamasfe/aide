import { AbstractExtendedError } from "~/packages/result";

export class ErrorRetrievingSignupFlowId extends AbstractExtendedError {
  override name = "ErrorRetrievingSignupFlowId" as const;

  public newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new ErrorRetrievingSignupFlowId(
      "Error retrieving signup flow id",
      metadata,
      ErrorRetrievingSignupFlowId.parseCause(unknownError),
    );
  }
}
