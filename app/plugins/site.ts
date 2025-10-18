export default defineNuxtPlugin({
  name: "site",
  dependsOn: ["api-client"],
  parallel: true,
  async setup(_nuxtApp) {
    const siteStore = useSiteStore();
    const logger = useLogger();
    const siteModule = useSiteModule();
    const runtimeConfig = useRuntimeConfig();

    if (import.meta.server) {
      await siteStore.setup(
        {
          logger: logger,
          findMatchedSite: () => siteModule.ui.findMatchedSite.handle(),
          findMatchedLicenses: () => siteModule.ui.findMatchedLicenses.handle(),
        },
      );

      /**
     * More info at https://nuxtseo.com/docs/site-config/nitro-api/update-site-config
     */
      updateSiteConfig({
        name: siteStore.currentSite.name,
        url: `${runtimeConfig.public.apiClientProtocol}${siteStore.currentDomain.frontend}`,
      });

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
