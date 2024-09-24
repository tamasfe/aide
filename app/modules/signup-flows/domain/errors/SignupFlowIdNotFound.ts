import { CustomError } from "~/packages/result";

export class SignupFlowIdNotFound extends CustomError {
  override name = "SignupFlowIdNotFound" as const;

  constructor(metadata: Record<string, unknown>) {
    super("Signup flow id not found", metadata);
  }
}
