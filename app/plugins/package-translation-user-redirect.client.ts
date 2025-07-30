import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "package-translation-user-redirect",
  dependsOn: ["module-users-initiator"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies, $i18n } = useNuxtApp();

    const userSelectedLocale = await $dependencies.common.i18n.ui.searchUserSelectedLocaleOnClientReady.handle();
    if (userSelectedLocale && userSelectedLocale !== $i18n.locale.value) {
      /**
       * We set a timeout because, for some reason, calling the "await $i18n.setLocale(preferredLocale)"
       * does not work as expected (the locale is not changed)
       */
      $dependencies.common.logger.warn("Setting the locale to the user specified one and redirecting them...", { userSelectedLocale });
      setTimeout(async () => {
        try {
          await $i18n.setLocale(userSelectedLocale);
        }
        catch (error) {
          $dependencies.common.logger.error("Error setting the locale to the user specified one",
            InfrastructureError.newFromUnknownError({ userSelectedLocale }, error),
          );
        }
      }, 150);
    }

    return {};
  },
});
