import type { SignupFlow } from "./SignupFlow";
import type { SignupFlowNotFound } from "./SignupFlowNotFound";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { EmptyResult, Result } from "~/packages/result";

export interface SignupFlowApiRepositoryI {
  getById(
    id: string,
  ): Promise<Result<SignupFlow, SignupFlowNotFound | InfrastructureError>>;
  create(): Promise<Result<string, InfrastructureError>>;
  submit(flowId: string): Promise<EmptyResult<InfrastructureError>>;
  update(signupFlow: SignupFlow): Promise<EmptyResult<InfrastructureError>>;
}
