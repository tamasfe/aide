import { CustomError } from "~/packages/result";

export class ErrorAlreadyTakenCpf extends CustomError {
  override name = "ErrorAlreadyTakenCpf" as const;

  constructor(metadata: Record<string, unknown> = {}) {
    super("There already exists a user with this CPF", metadata);
  }
}
