export default defineNuxtPlugin({
  name: "module-sites-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();

    const ENABLE_SERVER_SIDE_RENDERING = true;
    const DEFER_CLIENT_SIDE_LOADING = false;
    await useAsyncData("site-store-refresh",
      async () => {
        await siteStore.refresh();

        useHead({
          link: [
            {
              rel: "icon",
              type: "image/png",
              href: `/assets/${siteStore.site.identifier}/favicon.png`,
            },
            {
              rel: "stylesheet",
              type: "text/css",
              href: `/assets/${siteStore.site.identifier}/variables.css`,
            },
          ],
        });

        return 1;
      },
      { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
    );

    return {};
  },
});
