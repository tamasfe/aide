import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success, type EmptySuccessResult } from "~/packages/result";

export class EmitCommandOpenUserActionModalModal {
  constructor(private readonly asyncMessagePublisher: AsyncMessagePublisherI) {

  }

  public async handle(modalToOpen: "login" | "register" | "search"): Promise<EmptySuccessResult> {
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
    }
  }
}
