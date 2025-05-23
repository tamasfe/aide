import { AbstractExtendedError } from "~/packages/result";

export class ExceptionGettingUserFingerprint extends AbstractExtendedError {
  public name = "ExceptionGettingUserFingerprint" as const;

  public static newFromUnknownError(
    metadata: Record<string, unknown>,
    error: unknown,
  ) {
    return new ExceptionGettingUserFingerprint(metadata, ExceptionGettingUserFingerprint.parseCause(error));
  }

  constructor(
    metadata: Record<string, unknown>,
    public override readonly cause: Error,
  ) {
    super(
      "Error getting user fingerprint",
      {
        ...metadata,
        rawError: JSON.stringify(cause),
      },
      cause,
    );
  }
}
