import type { CustomError } from "./custom-error";
import { AbstractExtendedError } from "./extended-error";

export class InfrastructureError extends AbstractExtendedError {
  override name = "InfrastructureError" as const;

  public static newFromError(metadata: Record<string, unknown>, error: Error | CustomError) {
    return new InfrastructureError(
      error.message || "Unknown infrastructure error. More information in the cause",
      metadata,
      error,
    );
  }

  public static newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    const error = InfrastructureError.parseCause(unknownError);
    return new InfrastructureError(
      error.message || "Unknown infrastructure error. More information in the cause",
      metadata,
      error,
    );
  }
}
