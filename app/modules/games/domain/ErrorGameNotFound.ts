import { CustomError } from "~/packages/result";

export class ErrorGameNotFound extends CustomError {
  override name = "ErrorGameNotFound" as const;

  public static newFromGameIdentifier(gameIdentifier: string) {
    return new ErrorGameNotFound({ gameIdentifier });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The game was not found", metadata);
  }
}
