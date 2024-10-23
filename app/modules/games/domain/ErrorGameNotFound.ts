import { CustomError } from "~/packages/result";

export class ErrorGameNotFound extends CustomError {
  override name = "ErrorGameNotFound" as const;

  public static newFromGameId(gameId: number) {
    return new ErrorGameNotFound({ gameId });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The game was not found", metadata);
  }
}
