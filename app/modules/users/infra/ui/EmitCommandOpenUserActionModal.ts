import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";
import { success, type EmptySuccessResult } from "~/packages/result";

type NoDataRequiredModal = "login" | "register" | "search" | "forgot_password" | "deposit" | "withdrawal" | "close_account";

/**
 * Todo: probably move this to a dedicated package folder or similar and pair it with
 */
type Alert = {
  level: "info" | "warning" | "error" | "success";
  message: string;
};

export class EmitCommandOpenUserActionModalModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(modalOrData: UserInteractionModalState | NoDataRequiredModal, alert?: Alert): Promise<EmptySuccessResult> {
    const modalState = typeof modalOrData === "string" ? { modal: modalOrData, alert } : { ...modalOrData, alert };
    await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", modalState);
    return success();
  }
}
