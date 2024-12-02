import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success, type EmptySuccessResult } from "~/packages/result";

export class EmitCommandOpenUserActionModalModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(modalToOpen: "login" | "register" | "search" | "forgot_password" | "deposit" | "deposit_confirm" | "withdrawal"): Promise<EmptySuccessResult>;
  public async handle(modalToOpen: "recover_password", data: { token: string }): Promise<EmptySuccessResult>;
  public async handle(modalToOpen: "settings", data: { setting: "password" }): Promise<EmptySuccessResult>;
  public async handle(modalToOpen: "login" | "register" | "search" | "forgot_password" | "deposit" | "deposit_confirm" | "withdrawal" | "recover_password" | "settings", data?: { setting?: "password"; token?: string }): Promise<EmptySuccessResult> {
    switch (modalToOpen) {
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
        if (!data?.setting) {
          throw new Error("Setting is required to open the recover update settings modal. This should never happen.");
        }
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-update-settings", { setting: data?.setting });
        return success();

      case "recover_password":
        if (!data?.token) {
          throw new Error("Token is required to open the recover password modal. This should never happen.");
        }
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-recover-password", { token: data?.token });
        return success();
    }
  }
}
