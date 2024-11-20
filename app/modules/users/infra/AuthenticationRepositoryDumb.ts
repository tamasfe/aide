import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import type { ErrorInvalidAuthCredentials } from "../domain/errors/ErrorInvalidAuthCredentials";
import type { LoggerI } from "~/packages/logger/Logger";
import { success, type EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class AuthenticationRepositoryDumb implements AuthenticationRepositoryI {
  constructor(private logger: LoggerI) {}

  public async login(email: string, _password: string): Promise<EmptyResult<ErrorInvalidAuthCredentials | InfrastructureError>> {
    this.logger.debug("login called", { email });
    return success();
  }

  public async logout(): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("logout called", {});
    return success();
  }

  public async resetPassword(newPassword: string, token: string): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("resetPassword called", { newPassword, token });
    return success();
  }
}
