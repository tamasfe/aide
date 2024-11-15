import { CustomError } from "~/packages/result";

export class ErrorAlreadyTakenTelephone extends CustomError {
  override name = "ErrorAlreadyTakenTelephone" as const;

  constructor(metadata: Record<string, unknown> = {}) {
    super("There already exists a user with this telephone", metadata);
  }
}
