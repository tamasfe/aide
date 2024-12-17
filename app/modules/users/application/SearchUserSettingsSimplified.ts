import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { UserSettingsPropsI } from "../domain/UserSettings";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import { success, type Result } from "~/packages/result";

export interface SearchUserSettingsResponseI {
  timeZone: UserSettingsPropsI["timeZone"];
  locale: UserSettingsPropsI["locale"];
  payment: UserSettingsPropsI["payment"];
  simplifiedConsents: {
    email: boolean | null;
    phone: boolean | null;
    browser: boolean | null;
  };
}

export class SearchUserSettingsSimplified {
  constructor(private readonly authenticatedUserRepo: AuthenticatedUserRepositoryI) {}

  public async handle(): Promise<Result<null | SearchUserSettingsResponseI, InfrastructureError>> {
    const settingsResult = await this.authenticatedUserRepo.searchSettings();
    if (settingsResult.isFailure) {
      return settingsResult;
    }

    if (!settingsResult.value) {
      return success(null);
    }

    return success({
      ...settingsResult.value.toJSON(),
      simplifiedConsents: settingsResult.value.simplifiedConsents,
    });
  }
}
