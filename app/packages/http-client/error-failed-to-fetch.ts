import { CustomError } from "../result";

export class ErrorFailedToFetch extends CustomError {
  override name = "ErrorFailedToFetch" as const;

  public static new(url: string, extraMetadata: Record<string, unknown> = {}) {
    return new ErrorFailedToFetch(url, undefined, extraMetadata);
  }

  public static newWithCause(url: string, originalError: Error, extraMetadata: Record<string, unknown> = {}) {
    return new ErrorFailedToFetch(url, originalError, extraMetadata);
  }

  private constructor(public readonly url: string, originalError: Error | undefined, extraMetadata: Record<string, unknown>) {
    super("Error in fetch API, failed to fetch. It's probably a CORS error, but it is not for sure.", extraMetadata);
    if (originalError) {
      this.cause = originalError;
    }
  }
}
