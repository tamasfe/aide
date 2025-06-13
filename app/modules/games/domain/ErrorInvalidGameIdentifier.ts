import { CustomError } from "~/packages/result";

export class ErrorInvalidGameIdentifier extends CustomError {
  override name = "ErrorInvalidGameIdentifier" as const;

  constructor(attemptedGameIdentifier: string) {
    super("Invalid game identifier attempted", { attemptedGameIdentifier });
  }
}
