export default defineNuxtPlugin({
  name: "module-sites-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();

    await useAsyncData("site-store-refresh",
      async () => {
        await siteStore.refresh();
        return 1;
      },
    );

    if (import.meta.server) {
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
    }

    return {};
  },
});
