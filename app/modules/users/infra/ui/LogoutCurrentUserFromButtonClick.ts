import type { LogoutUser } from "../../application/LogoutUser";
import type { LoggerI } from "~/packages/logger/Logger";

export class LogoutCurrentUserFromButtonClick {
  constructor(
    private command: LogoutUser,
    private logger: LoggerI,
  ) {}

  public async handle() {
    const result = await this.command.handle();
    if (result.isFailure) {
      this.logger.error("Failed to logout user from nav bar", { error: result.error });
    }

    return;
  }
}
