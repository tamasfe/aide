import { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import { success, type EmptyResult } from "~/packages/result";

export class SignupFlowApiRepositoryDumb implements SignupFlowApiRepositoryI {
  public async getById(
    id: string,
  ) {
    console.debug("SignupFlowApiRepositoryDumb.getById called with...", id);
    return success(SignupFlow.newFromProps({
      id,
      email: null,
      password: null,
      cpf: null,
      telephone: null,
      timeZone: null,
      locale: null,
      utmParameters: null,
    }));
  }

  public async create() {
    console.debug("SignupFlowApiRepositoryDumb.create called");
    return success("1");
  }

  public async submit(flowId: string): Promise<EmptyResult<InfrastructureError>> {
    console.debug("SignupFlowApiRepositoryDumb.submit called with flowId: ", flowId);
    return success();
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
