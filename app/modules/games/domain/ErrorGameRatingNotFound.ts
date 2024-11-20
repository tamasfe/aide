import { CustomError } from "~/packages/result";

export class ErrorGameRatingNotFound extends CustomError {
  override name = "ErrorGameRatingNotFound" as const;

  public static newFromGameId(gameId: number) {
    return new ErrorGameRatingNotFound({ gameId });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The game rating was not found", metadata);
  }
}
