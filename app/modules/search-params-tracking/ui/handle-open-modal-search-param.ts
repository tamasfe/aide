import type { UsersPreviousActivityCookieRepo } from "../users-previous-activity-cookie-repo";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";

export class HandleOpenModalSearchParam {
  constructor(
    private readonly usersPreviousActivity: UsersPreviousActivityCookieRepo,
    private readonly logger: LoggerI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
    private readonly redirectToPasswordSettingsPage: () => Promise<void>,
  ) {}

  public async handle(openModalSearchParam: string | null, userIsCurrentlyLoggedIn: boolean) {
    if (!openModalSearchParam) {
      return;
    }

    const userHasPreviouslyLoggedIn = this.userHasPreviouslyLoggedIn();

    switch (openModalSearchParam) {
      // Same behaviour
      case "login":
      case "register":
        if (userIsCurrentlyLoggedIn) {
          return;
        }
        if (userHasPreviouslyLoggedIn) {
          await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "login" });
          return;
        }
        await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
        return;

      case "forgot":
        if (userIsCurrentlyLoggedIn) {
          return this.redirectToPasswordSettingsPage();
        }
        await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "forgot_password" });
        return;

      case "deposit":
        if (userIsCurrentlyLoggedIn) {
          await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
          return;
        }

        if (userHasPreviouslyLoggedIn) {
          await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "login" });
          this.asyncMessagePublisher.subscribe("frontend:events:users:user-logged-in", () =>
            callOnce("open-deposit-modal-after-login",
              () => this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" }),
            ),
          );
          return;
        }
        await this.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
        return;
    }
  }

  private userHasPreviouslyLoggedIn(): boolean {
    const previousActivityResult = this.usersPreviousActivity.hasPreviouslyLoggedIn();
    if (previousActivityResult.isFailure) {
      this.logger.error("Error retrieving the previous activity of the current user on site. Tolerating by defaulting to false.", previousActivityResult.error);
      return false;
    }
    return previousActivityResult.value;
  }
}
