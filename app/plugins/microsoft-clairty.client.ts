import { AbstractExtendedError } from "~/packages/result";
import Clarity from "@microsoft/clarity";

class ErrorInitiatingClarity extends AbstractExtendedError {
  name = "ErrorInitiatingClarity" as const;

  constructor(cause: Error, metadata: Record<string, unknown> = {}) {
    super("There was an error initiating Clarity", metadata, cause);
  }
}

export default defineNuxtPlugin({
  name: "clarity",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(nuxtApp) {
    const CLARITY_SITE_ID = "t2diq6qift";

    /*
     * We want to initialise it as late as possible to disrupt the user experience as little as possible.
     */
    nuxtApp.hook("app:mounted", async () => {
      const { $dependencies } = useNuxtApp();
      const userStore = useUserStore();
      const route = useRoute();

      try {
        Clarity.init(CLARITY_SITE_ID);
      }
      catch (error) {
        $dependencies.common.logger.error(
          "Error initializing Clarity.",
          new ErrorInitiatingClarity(ErrorInitiatingClarity.parseCause(error), { CLARITY_SITE_ID }),
        );
        return;
      }

      /**
       * Identify the user
       */
      nuxtApp.hook("page:finish", () => {
        if (userStore.user) {
          Clarity.identify(String(userStore.user.id), undefined, route.fullPath, userStore.user.username);
        }
      });

      watch(
        () => userStore.user,
        (user) => {
          if (!user) return;
          Clarity.identify(String(user.id), undefined, route.fullPath, user.username);
        },
      );

      /**
       * Upgrade session & log interesting events
       */
      $dependencies.common.asyncMessagePublisher.subscribe("frontend:events:signup-flows:signup-flow-submitted", () => {
        Clarity.upgrade("signup");
        Clarity.event("signup");
      });

      $dependencies.common.asyncMessagePublisher.subscribe("frontend:events:games:game-session-started", () => {
        Clarity.event("game-session-started");
      });

      $dependencies.common.asyncMessagePublisher.subscribe("frontend:events:payments:deposit-flow-created", () => {
        Clarity.upgrade("deposit-created");
        Clarity.event("deposit-created");
      });

      $dependencies.common.asyncMessagePublisher.subscribe("backend:events:payments:payment-status-updated", (event) => {
        if (event.data.status === "succeeded") {
          Clarity.upgrade("deposit-succeeded");
          Clarity.event("deposit-succeeded");
        }
      });
    });
  },
});
