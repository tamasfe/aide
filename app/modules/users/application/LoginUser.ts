import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class LoginUser {
  constructor(
    private authenticationRepository: AuthenticationRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(
    username: string,
    password: string,
  ) {
    const result = await this.authenticationRepository.login(username, password);
    if (result.isFailure) {
      return result;
    }

    this.asyncMessagePublisher.emit("frontend:events:users:user-logged-in", {});
    return success();
  }
}
