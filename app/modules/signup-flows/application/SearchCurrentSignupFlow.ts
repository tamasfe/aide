import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { SignupFlowNotFound } from "../domain/SignupFlowNotFound";
import { success } from "~/packages/result";

export class SearchCurrentSignupFlow {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private repository: SignupFlowApiRepositoryI,
  ) {}

  public async handle() {
    const flowIdResult = await this.flowIdClientRepository.searchCurrent();
    if (flowIdResult.isFailure) {
      return flowIdResult;
    }

    if (!flowIdResult.value) {
      return success(null);
    }

    const flowResult = await this.repository.getById(flowIdResult.value);
    if (flowResult.isFailure) {
      if (flowResult.error instanceof SignupFlowNotFound) {
        await this.flowIdClientRepository.deleteCurrent();
        return success(null);
      }
      return flowResult;
    }

    return success(flowResult.value.toJSON());
  }
}
