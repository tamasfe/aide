import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";

export class DeleteCurrentSignupFlowId {
  constructor(private signupFlowIdsRepo: SignupFlowIdClientRepositoryI) {}

  public async handle() {
    return this.signupFlowIdsRepo.deleteCurrent();
  }
}
