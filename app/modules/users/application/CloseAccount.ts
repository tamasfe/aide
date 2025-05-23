import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class CloseAccount {
  constructor(private repo: AuthenticatedUserRepositoryI, private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(reason: string | null, currentPassword: string) {
    const result = await this.repo.closeAccount(reason, currentPassword);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("frontend:events:users:user-closed-account", {});

    return success();
  }
}
