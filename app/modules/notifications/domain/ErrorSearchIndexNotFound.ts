import { CustomError } from "~/packages/result";

export class ErrorSearchIndexNotFound extends CustomError {
  override name = "ErrorSearchIndexNotFound" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorSearchIndexNotFound(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The notification search index was not found", metadata);
  }
}
