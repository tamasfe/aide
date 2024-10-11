import type { ErrorInvalidAuthCredentials } from "./errors/ErrorInvalidAuthCredentials";
import type { EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface AuthenticationRepositoryI {
  login(username: string, password: string): Promise<EmptyResult<ErrorInvalidAuthCredentials | InfrastructureError>>;
}
