import { CustomError } from "~/packages/result";

export class ErrorAlreadyTakenEmail extends CustomError {
  override name = "ErrorAlreadyTakenEmail" as const;

  constructor(metadata: Record<string, unknown> = {}) {
    super("There already exists a user with this email", metadata);
  }
}
