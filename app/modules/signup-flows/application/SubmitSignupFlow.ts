import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";

export class SubmitSignupFlow {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
  ) {

  }

  public async handle() {
    const flowIdResult = await this.flowIdClientRepository.findCurrent();
    if (flowIdResult.isFailure) {
      return flowIdResult;
    }

    const flowId = flowIdResult.value;

    return this.apiRepository.submit(flowId);
  }
}
