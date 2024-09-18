import { AbstractExtendedError } from "./extended-error";

export class InfrastructureError extends AbstractExtendedError {
  override name = "InfrastructureError" as const;

  public newFromUnknownError(metadata: Record<string, unknown>, unknownError: unknown) {
    return new InfrastructureError(
      "Unknown infrastructure error. More information in the cause",
      metadata,
      InfrastructureError.parseCause(unknownError),
    );
  }
}
