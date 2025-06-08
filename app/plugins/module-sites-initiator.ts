export default defineNuxtPlugin({
  name: "module-sites-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();

    await callOnce("site-store-init", async () => siteStore.refresh());

    /**
     * More info at https://nuxtseo.com/docs/site-config/nitro-api/update-site-config
     */
    updateSiteConfig({
      name: siteStore.siteResponse.site.name,
    });

    if (import.meta.server) {
      useHead({
        link: [
          {
            rel: "icon",
            type: "image/png",
            href: `/assets/${siteStore.siteResponse.site.identifier}/favicon.png`,
          },
          {
            rel: "stylesheet",
            type: "text/css",
            href: `/assets/${siteStore.siteResponse.site.identifier}/variables.css`,
          },
        ],
      });
    }

    return {};
  },
});
