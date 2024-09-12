import { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowNotFound } from "../domain/SignupFlowNotFound";
import type {
  CustomError,
  ExtendedError,
  success,
  type EmptyResult,
  type Result,
} from "~/packages/result";

export class SignupFlowApiRepositoryDumb implements SignupFlowApiRepositoryI {
  public async getById(
    id: string,
  ): Promise<Result<SignupFlow, ExtendedError | SignupFlowNotFound>> {
    console.log("SignupFlowApiRepositoryDumb.getById called with...", id);
    return SignupFlow.newFromProps(id, null, null, null);
  }

  public async create(): Promise<Result<SignupFlow, CustomError>> {
    console.log("SignupFlowApiRepositoryDumb.create called");
    return SignupFlow.newFromProps("1", null, null, null);
  }

  public async update(
    signupFlow: SignupFlow,
  ): Promise<EmptyResult<CustomError>> {
    console.log(
      "SignupFlowApiRepositoryDumb.update called with...",
      signupFlow,
    );
    return success();
  }
}
