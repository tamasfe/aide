import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { success } from "~/packages/result";

export class CreateSignupFlow {
  constructor(
    private readonly apiRepository: SignupFlowApiRepositoryI,
    private readonly clientIdRepository: SignupFlowIdClientRepositoryI,
  ) {}

  public async handle() {
    const createResult = await this.apiRepository.create();
    if (createResult.isFailure) {
      return createResult;
    }

    const saveResult = await this.clientIdRepository.saveCurrent(createResult.value);
    if (saveResult.isFailure) {
      return saveResult;
    }

    return success();
  }
}
