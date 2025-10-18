import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { success } from "~/packages/result";
import type { NuxtApp } from "#app";

export class LogoutUser {
  constructor(
    private authenticationRepository: AuthenticationRepositoryI,
    private nuxtApp: NuxtApp,
  ) {}

  public async handle(
  ) {
    const result = await this.authenticationRepository.logout();
    if (result.isFailure) {
      return result;
    }

    this.nuxtApp.callHook("frontend:events:users:user-logged-out");

    return success();
  }
}
