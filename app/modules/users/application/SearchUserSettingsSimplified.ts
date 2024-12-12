import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { UserSettingsI } from "../domain/UserSettings";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import { success, type Result } from "~/packages/result";

interface SimplifiedConsentsI {
  email: boolean | null;
  phone: boolean | null;
  browser: boolean | null;
}

export interface UserSettingSimplifiedI {
  timeZone: UserSettingsI["timeZone"];
  payment: UserSettingsI["payment"];
  consents: SimplifiedConsentsI;
  locale: UserSettingsI["locale"];
}

export class SearchUserSettingsSimplified {
  constructor(private readonly authenticatedUserRepo: AuthenticatedUserRepositoryI) {}

  public async handle(): Promise<Result<null | UserSettingSimplifiedI, InfrastructureError>> {
    const settingsResult = await this.authenticatedUserRepo.searchSettings();
    if (settingsResult.isFailure) {
      return settingsResult;
    }

    if (!settingsResult.value) {
      return success(null);
    }

    return success({
      ...settingsResult.value,
      consents: {
        email: settingsResult.value.consents.email,
        phone: settingsResult.value.consents.sms,
        browser: settingsResult.value.consents.pushNotification,
      },
    });
  }

  public static simplifiedToUserConsents(consents: {
    email?: boolean | null;
    phone?: boolean | null;
    browser?: boolean | null;
  }): Partial<UserSettingsI["consents"]> {
    const partialConsents: Partial<UserSettingsI["consents"]> = {};
    if (consents.email !== undefined) {
      partialConsents.email = consents.email;
      partialConsents.postMail = consents.email;
    }
    if (consents.phone !== undefined) {
      partialConsents.telephone = consents.phone;
      partialConsents.sms = consents.phone;
    }
    if (consents.browser !== undefined) {
      partialConsents.pushNotification = consents.browser;
      partialConsents.siteNotification = consents.browser;
    }
    return partialConsents;
  }
}
