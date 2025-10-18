import type { NuxtApp } from "#app";
import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { success } from "~/packages/result";

export class LoginUser {
  constructor(
    private authenticationRepository: AuthenticationRepositoryI,
    private nuxtApp: NuxtApp,
  ) {}

  public async handle(
    username: string,
    password: string,
  ) {
    const result = await this.authenticationRepository.login(username, password);
    if (result.isFailure) {
      return result;
    }

    this.nuxtApp.callHook("frontend:events:users:user-logged-in");
    return success();
  }
}
