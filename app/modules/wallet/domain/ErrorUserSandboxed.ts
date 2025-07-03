import { CustomError } from "~/packages/result";

export class ErrorUserSandboxed extends CustomError {
  override name = "ErrorUserSandboxed" as const;

  constructor() {
    super("The user is sandboxed, and can not perform this action", { });
  }
}
