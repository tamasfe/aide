import { CustomError } from "../result";

export class ErrorFailedToFetch extends CustomError {
  override name = "ErrorFailedToFetch" as const;

  public static new(url: string, extraMetadata: Record<string, unknown> = {}) {
    return new ErrorFailedToFetch(url, extraMetadata);
  }

  private constructor(public readonly url: string, extraMetadata: Record<string, unknown>) {
    super("Error in fetch API, failed to fetch. It's probably a CORS error, but it is not for sure.", extraMetadata);
  }
}
