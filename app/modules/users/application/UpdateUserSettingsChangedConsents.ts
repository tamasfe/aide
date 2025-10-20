import type { NuxtApp } from "#app";
import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { UserSettings, type UserSettingsPropsI } from "../domain/UserSettings";
import type { SearchUserSettingsResponseI } from "./SearchUserSettingsSimplified";
import { success } from "~/packages/result";

export class UpdateUserSettingsChangedConsents {
  public constructor(
    private readonly authenticatedUserRepository: AuthenticatedUserRepositoryI,
    private readonly nuxtApp: NuxtApp,
  ) {}

  public async handle(
    initialConsents: Partial<SearchUserSettingsResponseI["simplifiedConsents"]>,
    newConsents: Partial<SearchUserSettingsResponseI["simplifiedConsents"]>,
  ) {
    const consentsToUpdate = this.compareAndReturnOnlyUpdated(
      UserSettings.simplifiedToConsentsProps(initialConsents),
      UserSettings.simplifiedToConsentsProps(newConsents),
    );

    if (Object.keys(consentsToUpdate).length === 0) {
      return success();
    }

    const result = await this.authenticatedUserRepository.updateSettings({ consents: consentsToUpdate });
    if (result.isFailure) {
      return result;
    }

    await this.nuxtApp.callHook("frontend:event:user:settings-updated", {
      settings: {
        locale: undefined,
        password: false,
        consents: consentsToUpdate,
      },
    });

    return success();
  }

  private compareAndReturnOnlyUpdated(initialConsents: Partial<UserSettingsPropsI["consents"]>, newConsents: Partial<UserSettingsPropsI["consents"]>): Partial<UserSettingsPropsI["consents"]> {
    const updatedConsents: Partial<UserSettingsPropsI["consents"]> = {};

    for (const key of Object.keys(newConsents) as Array<keyof typeof newConsents>) {
      if (initialConsents[key] === newConsents[key]) {
        continue;
      }

      if (initialConsents[key] === null && newConsents[key] === false) {
        continue;
      }

      updatedConsents[key] = newConsents[key];
    }

    return updatedConsents;
  }
}
