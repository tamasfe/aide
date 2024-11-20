import type { ErrorInvalidAuthCredentials } from "./errors/ErrorInvalidAuthCredentials";
import type { ErrorInvalidPasswordRecoveryToken } from "./errors/ErrorInvalidPasswordRecoveryToken";
import type { EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface AuthenticationRepositoryI {
  login(username: string, password: string): Promise<EmptyResult<ErrorInvalidAuthCredentials | InfrastructureError>>;
  logout(): Promise<EmptyResult<InfrastructureError>>;

  resetPassword(newPassword: string, token: string): Promise<EmptyResult<ErrorInvalidPasswordRecoveryToken | InfrastructureError>>;
}
