import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { UserTelephone } from "../domain/UserTelephone";
import { newExtendedUser, newLimitedExtendedUser } from "../domain/User";
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

    const userTelephoneResult = UserTelephone.new(String(authenticatedUserResult.value.phone.national.value), `+${authenticatedUserResult.value.phone.code.value}`);

    if (userTelephoneResult.isFailure) {
      return userTelephoneResult;
    }

    const extendedUserResult = newExtendedUser(authenticatedUserResult.value);
    if (extendedUserResult.isFailure) {
      this.logger.warn("Error building extended user. Tolerating it but returning limited user information", { error: extendedUserResult.error, user: authenticatedUserResult.value });
      return success(newLimitedExtendedUser(authenticatedUserResult.value));
    }

    return extendedUserResult;
  }
}
