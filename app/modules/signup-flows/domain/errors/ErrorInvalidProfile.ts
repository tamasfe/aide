import { CustomError } from "~/packages/result";

export class ErrorInvalidProfile extends CustomError {
  name = "ErrorInvalidProfile" as const;

  constructor(metadata: Record<string, unknown> = {}) {
    super("This profile is invalid and cannot sign up", metadata);
  }
}
