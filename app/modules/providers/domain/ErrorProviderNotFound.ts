import { CustomError } from "~/packages/result";

export class ErrorProviderNotFound extends CustomError {
  override name = "ErrorProviderNotFound" as const;

  public static newFromIdentifier(identifier: string) {
    return new ErrorProviderNotFound({ identifier });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The provider was not found", metadata);
  }
}
