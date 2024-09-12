import type { SignupFlow } from "./SignupFlow";
import type { SignupFlowNotFound } from "./SignupFlowNotFound";
import type { CustomError, EmptyResult, Result } from "~/packages/result";

export interface SignupFlowApiRepositoryI {
  getById(
    id: string,
  ): Promise<Result<SignupFlow, SignupFlowNotFound | CustomError>>;
  create(): Promise<Result<SignupFlow, CustomError>>;
  update(signupFlow: SignupFlow): Promise<EmptyResult<CustomError>>;
}
