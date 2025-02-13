import type { Site } from "~/modules/sites/domain/Site";

type SiteAugmented = Site & {
  supportEmail: string;
};

const defaultSite: SiteAugmented = {
  identifier: "girobet",
  name: "GiroBet",
  servable: true,
  supportEmail: "support@girobet.vip",
  domains: [{ api: "https://api-staging.girobet.vip", frontend: "https://staging.girobet.vip" }],
};

export const useSiteStore = defineStore("siteStore", {
  state: (): SiteAugmented => ({
    ...defaultSite,
  }),

  actions: {
    async refresh() {
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.sites.ui.findMatchedSite.handle();
      if (result.isFailure) {
        $dependencies.common.logger.error("Error searching for current site, loading default Girobet one in order to not break the site", result.error);
        this.$state = { ...defaultSite };
        return;
      }

      if (result.value.name.toLowerCase() === "localhost") {
        this.$state = { ...defaultSite };
        return;
      }

      const supportEmail = `support@${result.value.domains[0]?.frontend}`;
      this.$state = { ...result.value, supportEmail };
    },

    getAssetPath(path: string) {
      return `/assets/${this.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
    },
  },
});
