import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { success } from "~/packages/result";

export class SearchCurrentSignupFlow {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
  ) {}

  public async handle() {
    const flowIdResult = await this.flowIdClientRepository.searchCurrent();
    if (flowIdResult.isFailure) {
      return flowIdResult;
    }

    if (!flowIdResult.value) {
      return success(null);
    }

    const flowResult = await this.apiRepository.getById(flowIdResult.value);
    if (flowResult.isFailure) {
      return flowResult;
    }

    return success(flowResult.value);
  }
}
