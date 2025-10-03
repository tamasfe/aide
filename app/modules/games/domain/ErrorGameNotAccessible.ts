import { CustomError } from "~/packages/result";

export class ErrorGameNotAccessible extends CustomError {
  override name = "ErrorGameNotAccessible" as const;

  constructor(gameIdentifier: string) {
    super("User does not have permission to play this game. This may be due to age restrictions, regional limitations, or account restrictions", { gameIdentifier });
  }
}
