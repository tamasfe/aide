import type { NuxtApp } from "#app";
import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { success } from "~/packages/result";

export class RecoverPassword {
  constructor(
    private authenticationRepo: AuthenticationRepositoryI,
    private nuxtApp: NuxtApp,
  ) {}

  public async handle(newPassword: string, token: string) {
    const result = await this.authenticationRepo.resetPassword(newPassword, token);
    if (result.isFailure) {
      return result;
    }

    await this.nuxtApp.callHook("frontend:events:users:password-recovered");

    return success();
  }
}
