import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { UserTelephone } from "../domain/UserTelephone";
import type { SupportedLocale } from "~/packages/translation";
import { success } from "~/packages/result";

interface UserResponseI {
  id: number;
  locale: SupportedLocale | null;
  timeZone: string;
  email: string;
  cpf: string | null;
  phone: {
    value: string;
    prefix: {
      value: string;
      countryCode: string;
    };
  };
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

    const userTelephoneResult = UserTelephone.newFromSingleValue(authenticatedUserResult.value.telephone);
    if (userTelephoneResult.isFailure) {
      return userTelephoneResult;
    }

    const userResponse: UserResponseI = {
      id: authenticatedUserResult.value.id,
      locale: authenticatedUserResult.value.locale,
      timeZone: authenticatedUserResult.value.timeZone,
      email: authenticatedUserResult.value.email,
      cpf: authenticatedUserResult.value.cpf?.value ?? null,
      phone: {
        value: userTelephoneResult.value.telephone,
        prefix: userTelephoneResult.value.prefix,
      },
    };

    return success(userResponse);
  }
}
