import type { NuxtApp } from "#app";
import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { success } from "~/packages/result";

export class CloseAccount {
  constructor(
    private repo: AuthenticatedUserRepositoryI,
    private nuxtApp: NuxtApp) {}

  public async handle(reason: string | null, currentPassword: string) {
    const result = await this.repo.closeAccount(reason, currentPassword);
    if (result.isFailure) {
      return result;
    }

    await this.nuxtApp.callHook("frontend:events:users:user-closed-account");

    return success();
  }
}
