import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { SupportedLocale } from "~/packages/translation";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class UpdateUserSettings {
  public constructor(
    private readonly authenticatedUserRepository: AuthenticatedUserRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(settings: {
    locale?: SupportedLocale;
  }) {
    const result = await this.authenticatedUserRepository.updateSettings(settings);

    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:users:user-settings-updated", {
      settings,
    });

    return success();
  }
}
