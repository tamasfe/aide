import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { success } from "~/packages/result";
import type { NuxtApp } from "#app";

export class SubmitSignupFlow {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private nuxtApp: NuxtApp,
  ) {

  }

  public async handle() {
    const flowIdResult = await this.flowIdClientRepository.findCurrent();
    if (flowIdResult.isFailure) {
      return flowIdResult;
    }

    const flowId = flowIdResult.value;

    const result = await this.apiRepository.submit(flowId);
    if (result.isFailure) {
      return result;
    }

    this.nuxtApp.callHook("frontend:events:signup-flows:signup-flow-submitted", {
      id: flowId,
    });

    return success();
  }
}
