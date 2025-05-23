import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class RecoverPassword {
  constructor(private authenticationRepo: AuthenticationRepositoryI, private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(newPassword: string, token: string) {
    const result = await this.authenticationRepo.resetPassword(newPassword, token);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("frontend:events:users:password-recovered", {});

    return success();
  }
}
