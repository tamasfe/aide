import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "package-translation-user-redirect",
  dependsOn: ["module-users-initiator"],
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.hook("app:mounted", async () => {
      const { $i18n, $dependencies } = useNuxtApp();
      const userSelectedLocale = await $dependencies.common.i18n.ui.searchUserSelectedLocaleOnClientReady.handle();
      try {
        if (userSelectedLocale && userSelectedLocale !== $i18n.locale.value) {
          $dependencies.common.logger.warn("Setting the locale to the user specified one and redirecting them...", { userSelectedLocale });
          await $i18n.setLocale(userSelectedLocale);
        }
      }
      catch (error) {
        $dependencies.common.logger.error("Error setting the locale to the user specified one",
          InfrastructureError.newFromUnknownError({ userSelectedLocale }, error),
        );
      }
    });

    return {};
  },
});
