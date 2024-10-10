import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class EmitCommandOpenLoginModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {

  }

  public async handle() {
    await this.asyncMessagePublisher.emit("girobet:commands:modals:open-login", {});
  }
}
