import { CustomError } from "~/packages/result";

export class ErrorProviderNotFound extends CustomError {
  override name = "ErrorProviderNotFound" as const;

  public static newFromId(id: number) {
    return new ErrorProviderNotFound({ id });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The provider was not found", metadata);
  }
}
