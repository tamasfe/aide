import type { NuxtApp } from "#app";
import type { UsersPreviousActivityCookieRepo } from "../users-previous-activity-cookie-repo";
import type { LoggerI } from "~/packages/logger/Logger";

export class HandleOpenModalSearchParam {
  constructor(
    private readonly usersPreviousActivity: UsersPreviousActivityCookieRepo,
    private readonly logger: LoggerI,
    private readonly nuxtApp: NuxtApp,
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
        if (userIsCurrentlyLoggedIn) {
          return;
        }
        if (userHasPreviouslyLoggedIn) {
          await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "login" });
          return;
        }
        await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "register" });

        this.nuxtApp.hook("frontend:event:signup-flow:submitted", () =>
          this.nuxtApp.callHook("frontend:command:modal:open", { modal: "login" }),
        );

        return;

      case "forgot":
        if (userIsCurrentlyLoggedIn) {
          return this.redirectToPasswordSettingsPage();
        }
        await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "forgot_password" });
        return;

      case "deposit":
        if (userIsCurrentlyLoggedIn) {
          await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "deposit" });
          return;
        }

        if (userHasPreviouslyLoggedIn) {
          await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "login" });

          this.nuxtApp.hook("frontend:event:user:logged-in", () =>
            this.nuxtApp.callHook("frontend:command:modal:open", { modal: "deposit" }),
          );

          return;
        }

        await this.nuxtApp.callHook("frontend:command:modal:open", { modal: "register" });

        this.nuxtApp.hook("frontend:event:signup-flow:submitted", () =>
          this.nuxtApp.callHook("frontend:command:modal:open", { modal: "deposit" }),
        );

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
