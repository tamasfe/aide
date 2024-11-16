import type { LoginUser } from "../../application/LoginUser";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation";

export class AttemptUserLoginOnFormSubmission {
  constructor(
    private query: LoginUser,
    private translateFunction: TranslateFunctionType,
    private logger: LoggerI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {
  }

  public async handle(username: string, password: string): Promise<string | null> {
    const loginResult = await this.query.handle(username, password);
    if (loginResult.isFailure) {
      if (loginResult.error.name === "ErrorInvalidAuthCredentials") {
        return this.translateFunction("modal_login.error_invalid_credentials");
      }

      this.logger.error("Something went wrong while trying to login the user", loginResult.error);
      return this.translateFunction("modal_login.error_unknown");
    }

    this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return null;
  }
}
