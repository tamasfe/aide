import type { UpdateUserSettings } from "../../../application/UpdateUserSettings";
import type { SupportedLocale } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

export class UpdateUserLocaleOnLocaleSelect {
  constructor(
    private readonly command: UpdateUserSettings,
    private readonly logger: LoggerI,
  ) {}

  public async handle(locale: SupportedLocale) {
    const result = await this.command.handle({ locale });
    if (result.isFailure) {
      this.logger.error("Error saving the selected user locale in their account", result.error);
    }
    return;
  }
}
