import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";
import { success, type EmptySuccessResult } from "~/packages/result";

type NoDataRequiredModal = "login" | "register" | "search" | "forgot_password" | "deposit" | "withdrawal";

export class EmitCommandOpenUserActionModalModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(modalOrData: UserInteractionModalState | NoDataRequiredModal): Promise<EmptySuccessResult> {
    const modalState = typeof modalOrData === "string" ? { modal: modalOrData } : modalOrData;
    await this.asyncMessagePublisher.emit("girobet:commands:modals:open-user-interaction-modal", modalState);
    return success();
  }
}
