import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { UserTelephone } from "../domain/UserTelephone";
import type { SupportedLocale } from "~/packages/translation";
import { success } from "~/packages/result";
import type { LoggerI } from "~/packages/logger/Logger";

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
  constructor(
    private readonly authenticatedUserRepo: AuthenticatedUserRepositoryI,
    private readonly logger: LoggerI,
  ) {}

  public async handle() {
    const authenticatedUserResult = await this.authenticatedUserRepo.searchProfile();
    this.logger.info("SearchAuthenticatedUser after search profile", { authenticatedUserResult });
    if (authenticatedUserResult.isFailure) {
      return authenticatedUserResult;
    }
    this.logger.info("SearchAuthenticatedUser after failure return", { authenticatedUserResult });

    if (authenticatedUserResult.value === null) {
      return success(null);
    }
    this.logger.info("SearchAuthenticatedUser after null return", { authenticatedUserResult });

    const userTelephoneResult = UserTelephone.newFromSingleValue(authenticatedUserResult.value.telephone);
    this.logger.info("SearchAuthenticatedUser after telephone", { userTelephoneResult });
    if (userTelephoneResult.isFailure) {
      return userTelephoneResult;
    }
    this.logger.info("SearchAuthenticatedUser after user telephone failure return", { userTelephoneResult });

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

    this.logger.info("SearchAuthenticatedUser before return", { userResponse });
    return success(userResponse);
  }
}
