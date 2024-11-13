import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";

export class DeleteCurrentSignupFlowId {
  constructor(private signupFlowIdsRepo: SignupFlowIdClientRepositoryI) {}

  public handle() {
    return this.signupFlowIdsRepo.deleteCurrent();
  }
}
