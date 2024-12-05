import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { UserSettingsI } from "../domain/UserSettings";
import { SearchUserSettingsSimplified, type UserSettingSimplifiedI } from "./SearchUserSettingsSimplified";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class UpdateUserSettingsChangedConsents {
  public constructor(
    private readonly authenticatedUserRepository: AuthenticatedUserRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(
    initialConsents: Partial<UserSettingSimplifiedI["consents"]>,
    newConsents: Partial<UserSettingSimplifiedI["consents"]>,
  ) {
    const consentsToUpdate = this.compareAndReturnOnlyUpdated(
      SearchUserSettingsSimplified.simplifiedToUserConsents(initialConsents),
      SearchUserSettingsSimplified.simplifiedToUserConsents(newConsents),
    );

    if (Object.keys(consentsToUpdate).length === 0) {
      return success();
    }

    const result = await this.authenticatedUserRepository.updateSettings({ consents: consentsToUpdate });
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:users:user-settings-updated", {
      settings: {
        locale: undefined,
        password: false,
        consents: consentsToUpdate,
      },
    });

    return success();
  }

  private compareAndReturnOnlyUpdated(initialConsents: Partial<UserSettingsI["consents"]>, newConsents: Partial<UserSettingsI["consents"]>): Partial<UserSettingsI["consents"]> {
    const updatedConsents: Partial<UserSettingsI["consents"]> = {};

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
