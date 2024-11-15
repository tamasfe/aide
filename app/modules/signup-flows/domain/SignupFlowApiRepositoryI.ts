import type { SignupFlow } from "./SignupFlow";
import type { SignupFlowNotFound } from "./SignupFlowNotFound";
import type { ErrorAlreadyTakenCpf } from "./errors/ErrorAlreadyTakenCpf";
import type { ErrorAlreadyTakenTelephone } from "./errors/ErrorAlreadyTakenTelephone";
import type { ErrorAlreadyTakenEmail } from "./errors/ErrorAlreadyTakenEmail";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface SignupFlowApiRepositoryI {
  getById(
    id: string,
  ): Promise<Result<SignupFlow, SignupFlowNotFound | InfrastructureError>>;
  create(): Promise<Result<string, InfrastructureError>>;
  submit(flowId: string): Promise<EmptyResult<InfrastructureError | ErrorAlreadyTakenCpf | ErrorAlreadyTakenTelephone | ErrorAlreadyTakenEmail>>;
  update(signupFlow: SignupFlow): Promise<EmptyResult<InfrastructureError>>;
}
