import { CustomError } from "~/packages/result";

export class SignupFlowNotFound extends CustomError {
  override name = "SignupFlowNotFound" as const;

  public static newFromId(id: string): SignupFlowNotFound {
    return new SignupFlowNotFound(`SignupFlow with id ${id} not found`);
  }
}
