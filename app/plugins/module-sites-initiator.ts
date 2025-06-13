export default defineNuxtPlugin({
  name: "module-sites-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();
    const { $dependencies } = useNuxtApp();
    await callOnce("site-store-init", () => siteStore.setup(
      {
        logger: $dependencies.common.logger,
        findMatchedSite: () => $dependencies.sites.ui.findMatchedSite.handle(),
        findMatchedLicenses: () => $dependencies.sites.ui.findMatchedLicenses.handle(),
      },
    ));

    /**
     * More info at https://nuxtseo.com/docs/site-config/nitro-api/update-site-config
     */
    updateSiteConfig({
      name: siteStore.currentSite.name,
    });

    if (import.meta.server) {
      useHead({
        link: [
          {
            rel: "icon",
            type: "image/png",
            href: `/assets/${siteStore.currentSite.identifier}/favicon.png`,
          },
          {
            rel: "stylesheet",
            type: "text/css",
            href: `/assets/${siteStore.currentSite.identifier}/variables.css`,
          },
        ],
      });
    }

    return {};
  },
});
