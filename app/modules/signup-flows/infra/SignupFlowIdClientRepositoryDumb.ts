import type { SignupFlowIdNotFound } from "../domain/errors/SignupFlowIdNotFound";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { ErrorDeletingSignupFlowId } from "../domain/errors/ErrorDeletingSignupFlowId";
import { success, type EmptyResult, type Result } from "~/packages/result";

export class SignupFlowIdClientRepositoryDumb
implements SignupFlowIdClientRepositoryI {
  public async findCurrent(): Promise<Result<string, SignupFlowIdNotFound>> {
    console.debug("findCurrent called");
    return success("1");
  }

  public async searchCurrent() {
    console.debug("searchCurrentFlowId called");
    return success("1");
  }

  public async saveCurrent(flowId: string) {
    console.debug("saveCurrent called with flowId: ", flowId);
    return success();
  }

  public async deleteCurrent(): Promise<EmptyResult<ErrorDeletingSignupFlowId>> {
    console.debug("deleteCurrent called");
    return success();
  }
}
