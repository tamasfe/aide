import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class LogoutUser {
  constructor(
    private authenticationRepository: AuthenticationRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(
  ) {
    const result = await this.authenticationRepository.logout();
    if (result.isFailure) {
      return result;
    }

    this.asyncMessagePublisher.emit("frontend:events:users:user-logged-out", {});

    return success();
  }
}
