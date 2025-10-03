import { CustomError } from "~/packages/result";

export class ErrorGameHasNoDemo extends CustomError {
  override name = "ErrorGameHasNoDemo" as const;

  constructor(gameIdentifier: string) {
    super("The game does not offer a demo", { gameIdentifier });
  }
}
