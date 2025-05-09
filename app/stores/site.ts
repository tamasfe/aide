import type { Site } from "~/modules/sites/domain/Site";
import type { License } from "~/modules/sites/domain/License";

type SiteDomain = Site["domains"][number];
const defaultDomain: SiteDomain = { api: "https://api-staging.girobet.vip", email: "support@girobet.vip", frontend: "https://staging.girobet.vip", cdn: "cdn.girobet.vip" };

const defaultSite: Site = {
  identifier: "girobet",
  name: "GiroBet",
  servable: true,
  domains: [defaultDomain],
};

export const useSiteStore = defineStore("siteStore", {
  state: (): { site: Site; licenses: License[] } => ({
    site: { ...defaultSite },
    licenses: [],
  }),

  getters: {
    currentDomain: (state): SiteDomain => {
      return state.site.domains.find((domain: SiteDomain) => useRequestURL().href.startsWith(domain.frontend)) || state.site.domains[0] || defaultDomain;
    },

    supportEmail: (): string => {
      /**
       * TODO: remove this hotfix when the backend returns a correct email for support
       */
      const url = useRequestURL();
      return `support@${url.host}`;
    },
  },

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

      if (resultFindingLicenses.isFailure) {
        $dependencies.common.logger.error("Error searching for licenses, loading default Girobet one in order to not break the site", resultFindingLicenses.error);
        this.$state = { site: { ...resultFindingSite.value }, licenses: [] };
        return;
      }

      if (resultFindingSite.value.name.toLowerCase() === "localhost") {
        this.$state = { site: { ...defaultSite }, licenses: resultFindingLicenses.value };
        return;
      }

      this.$state = { site: { ...resultFindingSite.value }, licenses: resultFindingLicenses.value };
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

    /**
     * Options is tied to what our CDN provider supports
     * In our case: Cloudflare https://developers.cloudflare.com/images/transform-images/transform-via-url/#format
     */
    getCdnGameImageUrl(gameIdentifier: string, options?: {
      format?: "avif" | "webp" | "jpeg";
      size?: "150w" | "300w" | "600w";
    }): string {
      const cdnDomain = this.currentDomain.cdn;
      const baseImagePath = `/games/${gameIdentifier}.webp`;

      if (!options) {
        return `https://${cdnDomain}${baseImagePath}`;
      }

      const transformations = [];

      if (options.format) {
        transformations.push(`format=${options.format}`);
      }

      if (options.size) {
        switch (options.size) {
          case "150w":
            transformations.push("width=150");
            transformations.push("quality=75");
            break;
          case "300w":
            transformations.push("width=300");
            transformations.push("quality=85");
            break;
          case "600w":
            transformations.push("width=600");
            break;
        }
      }

      return `https://${cdnDomain}/cdn-cgi/image/${transformations.join(",")}${baseImagePath}`;
    },
    getCdnProviderImageUrl(providerIdentifier: string): string {
      const cdnDomain = this.currentDomain.cdn;

      return `https://${cdnDomain}/providers/${providerIdentifier}/default/white.svg`;
    },

  },
});
