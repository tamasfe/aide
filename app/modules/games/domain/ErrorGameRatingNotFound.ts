import { CustomError } from "~/packages/result";

export class ErrorGameRatingNotFound extends CustomError {
  override name = "ErrorGameRatingNotFound" as const;

  public static newFromGameIdentifier(gameIdentifier: string) {
    return new ErrorGameRatingNotFound({ gameIdentifier });
  }

  private constructor(metadata: Record<string, unknown>) {
    super("The game rating was not found", metadata);
  }
}
