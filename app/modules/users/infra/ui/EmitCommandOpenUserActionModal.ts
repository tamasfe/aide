import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success, type EmptySuccessResult } from "~/packages/result";

type NoDataRequiredModal = "login" | "register" | "search" | "forgot_password" | "deposit" | "deposit_confirm" | "withdrawal";

type ModalData = {
  modal: NoDataRequiredModal;
} | {
  modal: "recover_password";
  data: { token: string };
} | {
  modal: "settings";
  data: { setting: "password" };
};

export class EmitCommandOpenUserActionModalModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(modalOrData: ModalData | NoDataRequiredModal): Promise<EmptySuccessResult> {
    const modalData = typeof modalOrData === "string" ? { modal: modalOrData } : modalOrData;
    switch (modalData.modal) {
      case "login":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-login", {});
        return success();

      case "register":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-register", {});
        return success();

      case "search":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-search", {});
        return success();

      case "forgot_password":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-forgot-password", {});
        return success();

      case "deposit":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-deposit", {});
        return success();

      case "deposit_confirm":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-deposit-confirm", {});
        return success();

      case "withdrawal":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-withdrawal", {});
        return success();

      case "settings":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-update-settings", modalData.data);
        return success();

      case "recover_password":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-recover-password", modalData.data);
        return success();
    }
  }
}
