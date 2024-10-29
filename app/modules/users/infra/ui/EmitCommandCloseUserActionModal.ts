import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success, type EmptySuccessResult } from "~/packages/result";

export class EmitCommandCloseUserActionModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {

  }

  public async handle(): Promise<EmptySuccessResult> {
    await this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});
    return success();
  }
}
