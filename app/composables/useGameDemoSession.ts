export default function (gameIdentifier: string, clientType: "desktop" | "mobile") {
  const { $dependencies } = useNuxtApp();
  const userStore = useUserStore();
  const i18n = useI18n();

  // We can enable server side rendering for the demo session, as no user specific data is required.
  // and thus the demo session can usually be generated on the edge.
  const { data } = useAsyncData(async () => {
    return await $dependencies.games.ui.createGameSessionDemoFromGamePage.handle(
      gameIdentifier,
      i18n.localeProperties.value.language || i18n.locale.value.split("-")[0] || "",
      clientType,
    );
  },
  {
    watch: [() => userStore.isAuthenticated],
    server: true,
  });

  return data;
}
