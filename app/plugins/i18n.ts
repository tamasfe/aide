import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "i18n",
  parallel: true,
  dependsOn: ["site"],
  async setup(nuxtApp) {
    nuxtApp.hook("app:mounted", async () => {
      const { $i18n } = useNuxtApp();
      const logger = useLogger();
      const i18nModule = usei18nModule();

      const userSelectedLocale = await i18nModule.ui.searchUserSelectedLocaleOnClientReady.handle();

      try {
        if (userSelectedLocale && userSelectedLocale !== $i18n.locale.value) {
          logger.warn("Setting the locale to the user specified one and redirecting them...", { userSelectedLocale });
          await $i18n.setLocale(userSelectedLocale);
        }
      }
      catch (error) {
        logger.error("Error setting the locale to the user specified one",
          InfrastructureError.newFromUnknownError({ userSelectedLocale }, error),
        );
      }
    });

    return {};
  },
});
