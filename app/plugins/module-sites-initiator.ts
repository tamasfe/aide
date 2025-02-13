export default defineNuxtPlugin({
  name: "module-sites-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();

    const ENABLE_SERVER_SIDE_RENDERING = true;
    const DEFER_CLIENT_SIDE_LOADING = true;
    await useAsyncData("site-store-refresh",
      () => siteStore.refresh().then(() => 1),
      { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
    );

    return {};
  },
});
