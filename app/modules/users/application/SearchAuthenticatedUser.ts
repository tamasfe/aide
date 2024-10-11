import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { success } from "~/packages/result";

interface UserResponseI {
  id: number;
  locale: string;
  timeZone: string;
}

export class SearchAuthenticatedUser {
  constructor(private readonly authenticatedUserRepo: AuthenticatedUserRepositoryI) {}

  public async handle() {
    const authenticatedUserResult = await this.authenticatedUserRepo.searchProfile();
    if (authenticatedUserResult.isFailure) {
      return authenticatedUserResult;
    }

    if (authenticatedUserResult.value === null) {
      return success(null);
    }

    const userResponse: UserResponseI = {
      id: authenticatedUserResult.value.id,
      locale: authenticatedUserResult.value.locale,
      timeZone: authenticatedUserResult.value.timeZone,
    };

    return success(userResponse);
  }
}
