import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { newExtendedUser } from "../domain/User";
import { success } from "~/packages/result";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchAuthenticatedUser {
  constructor(
    private readonly authenticatedUserRepo: AuthenticatedUserRepositoryI,
    private readonly logger: LoggerI,
  ) {}

  public async handle() {
    const authenticatedUserResult = await this.authenticatedUserRepo.searchProfile();
    if (authenticatedUserResult.isFailure) {
      return authenticatedUserResult;
    }

    if (authenticatedUserResult.value === null) {
      return success(null);
    }

    return success(newExtendedUser(authenticatedUserResult.value));
  }
}
