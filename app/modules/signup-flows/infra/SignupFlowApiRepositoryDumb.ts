import { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { success, unfold } from "~/packages/result";

export class SignupFlowApiRepositoryDumb implements SignupFlowApiRepositoryI {
  public async getById(
    id: string,
  ) {
    console.debug("SignupFlowApiRepositoryDumb.getById called with...", id);
    return success(unfold(SignupFlow.newFromProps({
      id,
      email: null,
      password: null,
      cpf: null,
      telephone: null,
    },
    )));
  }

  public async create() {
    console.debug("SignupFlowApiRepositoryDumb.create called");
    return success("1");
  }

  public async update(
    signupFlow: SignupFlow,
  ) {
    console.debug(
      "SignupFlowApiRepositoryDumb.update called with...",
      signupFlow,
    );
    return success();
  }
}
