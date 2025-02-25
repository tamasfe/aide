import type { Site } from "~/modules/sites/domain/Site";
import type { License } from "~/modules/sites/domain/License";

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
  state: (): { site: SiteAugmented; licenses: License[] } => ({
    site: { ...defaultSite },
    licenses: [],
  }),

  actions: {
    async refresh() {
      const { $dependencies } = useNuxtApp();
      const [resultFindingSite, resultFindingLicenses] = await Promise.all([
        $dependencies.sites.ui.findMatchedSite.handle(),
        $dependencies.sites.ui.findMatchedLicenses.handle(),
      ]);
      if (resultFindingSite.isFailure) {
        $dependencies.common.logger.error("Error searching for current site, loading default Girobet one in order to not break the site", resultFindingSite.error);
        this.$state = { site: { ...defaultSite }, licenses: [] };
        return;
      }

      const supportEmail = `support@${resultFindingSite.value.domains[0]?.frontend}`;

      if (resultFindingLicenses.isFailure) {
        $dependencies.common.logger.error("Error searching for licenses, loading default Girobet one in order to not break the site", resultFindingLicenses.error);
        this.$state = { site: { ...resultFindingSite.value, supportEmail }, licenses: [] };
        return;
      }

      if (resultFindingSite.value.name.toLowerCase() === "localhost") {
        this.$state = { site: { ...defaultSite }, licenses: resultFindingLicenses.value };
        return;
      }

      this.$state = { site: { ...resultFindingSite.value, supportEmail }, licenses: resultFindingLicenses.value };
    },

    getAssetPath(path: string) {
      return `/assets/${this.site.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
    },

    getActiveLicense(): License {
      const activeLicense = this.licenses[0]; // We return the first one as the backend returns them in order of priority
      if (!activeLicense) {
        throw new Error("No active license found. This should never happen as the site should either have a valid license or have thrown an invalid jurisdiction error");
      }
      return activeLicense;
    },
  },
});
