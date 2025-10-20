import * as Sentry from "@sentry/nuxt";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "sentry",
  dependsOn: ["user"],
  parallel: true,
  async setup() {
    const userStore = useUserStore();
    const logger = useLogger();

    watch(() => userStore.user, (user) => {
      try {
        if (!user) {
          Sentry.setUser(null);
          return;
        }

        Sentry.setUser({
          id: user.id.toString(),
          email: user.email,
          username: user.username,
        });
      }
      catch (error) {
        logger.error("Error setting Sentry user in userStore watch", InfrastructureError.newFromUnknownError({ user }, error));
      }
    }, { immediate: true });
  },
});
