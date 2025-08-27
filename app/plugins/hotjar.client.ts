import { CustomError } from "~/packages/result";

class ErrorInitiatingHotjar extends CustomError {
  name = "ErrorInitiatingHotjar" as const;

  constructor(metadata: Record<string, unknown> = {}) {
    super("There was an error initiating Hotjar", metadata);
  }
}

export default defineNuxtPlugin({
  name: "hotjar",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(nuxtApp) {
    const HOTJAR_SITE_ID = 6502694;
    const HOTJAR_SCRIPT_VERSION = 6;

    const { $dependencies } = useNuxtApp();
    const userStore = useUserStore();

    /*
     * We want to initialise hotjar as late as possible to disrupt the user experience as little as possible.
     */
    nuxtApp.hook("app:mounted", async () => {
      const { default: Hotjar } = await import("@hotjar/browser");
      const result = Hotjar.init(HOTJAR_SITE_ID, HOTJAR_SCRIPT_VERSION, {
        debug: false,
      });
      if (!result) {
        $dependencies.common.logger.error(
          "Error initializing Hotjar.",
          new ErrorInitiatingHotjar({ HOTJAR_SITE_ID, HOTJAR_SCRIPT_VERSION })
        );
        return;
      }

      if (userStore.user) {
        Hotjar.identify(String(userStore.user.id), {
          email: userStore.user.email,
          name: userStore.user.name,
        });
      }

      watch(
        () => userStore.user,
        (user) => {
          if (!user || !Hotjar.isReady()) return;
          Hotjar.identify(String(user.id), {
            email: user.email,
            name: user.name,
          });
        }
      );

      nuxtApp.hook("page:finish", () => {
        if (!Hotjar.isReady()) return;
        const route = useRoute();
        Hotjar.stateChange(route.fullPath);
      });
    });
  },
});
