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
      setTimeout(() => $i18n.setLocale(userSelectedLocale), 150);
    }

    return {};
  },
});
