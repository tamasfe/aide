import type { SiteResponse } from "~/modules/sites/domain/Site";
import type { License } from "~/modules/sites/domain/License";
import { ErrorAnjouanLicenseScriptWasNotFound } from "~/packages/licenses/ErrorAnjouanLicenseScriptWasNotFound";
import { ErrorInitiatingAnjouanLicenseScript } from "~/packages/licenses/ErrorInitiatingAnjouanLicenseScript";

type SiteDomain = SiteResponse["domain"];
const defaultDomain: SiteDomain = { api: "api-staging.girobet.vip", email: "girobet.vip", frontend: "staging.girobet.vip", cdn: "cdn.girobet.vip", tracking: "tracking.girobet.vip" };

const defaultSite: SiteResponse = {
  site: {
    identifier: "girobet",
    name: "GiroBet",
    servable: true,
  },
  domain: defaultDomain,
};

export const useSiteStore = defineStore("siteStore", {
  state: (): { siteResponse: SiteResponse; licenses: License[] } => ({
    siteResponse: { ...defaultSite },
    licenses: [],
  }),

  getters: {
    currentDomain: (state): SiteDomain => {
      return state.siteResponse.domain || defaultDomain;
    },

    supportEmail: (state): string => {
      return `support@${state.siteResponse.domain.email}`;
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
        this.$state = { siteResponse: { ...defaultSite }, licenses: [] };
        return;
      }

      if (resultFindingLicenses.isFailure) {
        $dependencies.common.logger.error("Error searching for licenses, loading default Girobet one in order to not break the site", resultFindingLicenses.error);
        this.$state = { siteResponse: { ...resultFindingSite.value }, licenses: [] };
        return;
      }

      if (resultFindingSite.value.site.name.toLowerCase() === "localhost") {
        this.$state = { siteResponse: { ...defaultSite }, licenses: resultFindingLicenses.value };
        return;
      }

      this.$state = { siteResponse: { ...resultFindingSite.value }, licenses: resultFindingLicenses.value };
    },

    getAssetPath(path: string) {
      return `/assets/${this.siteResponse.site.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
    },

    getActiveLicense(): License {
      const activeLicense = this.licenses[0]; // We return the first one as the backend returns them in order of priority
      if (!activeLicense) {
        throw new Error("No active license found. This should never happen as the site should either have a valid license or have thrown an invalid jurisdiction error");
      }
      return activeLicense;
    },

    activateAnjouanLicenseIfAvailable(): "active" | "inactive" {
      const { $dependencies } = useNuxtApp();
      switch (this.siteResponse.site.identifier) {
        case "zambabet":
          if (!window.anj_baee18f7_63ae_4aa0_b5d7_8160149e921b) {
            $dependencies.common.logger.error("Anjouan script not loaded properly.", new ErrorAnjouanLicenseScriptWasNotFound("The Anjouan license script was not found on the window object."));
            return "active";
          }

          try {
            window.anj_baee18f7_63ae_4aa0_b5d7_8160149e921b.init();
          }
          catch (error) {
            $dependencies.common.logger.error("Anjouan script could not be initialized.", new ErrorInitiatingAnjouanLicenseScript("The Anjouan license script ", {}, ErrorInitiatingAnjouanLicenseScript.parseCause(error)));
          }
          return "active";

        case "girobet":
        default:
          // Not implemented yet
          return "inactive";
      }
    },

    /**
     * Options is tied to what our CDN provider supports
     * In our case: Cloudflare https://developers.cloudflare.com/images/transform-images/transform-via-url/#format
     */
    getCdnGameImageUrl(gameIdentifier: string, options?: {
      format?: "avif" | "webp" | "jpeg";
      size?: "100w" | "200w" | "300w" | "600w";
      quality?: "100" | "85" | "75" | "50";
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
        transformations.push(`width=${options.size.replace("w", "")}`);
      }

      if (options.quality) {
        transformations.push(`quality=${options.quality}`);
      }

      return `https://${cdnDomain}/cdn-cgi/image/${transformations.join(",")}${baseImagePath}`;
    },
    getCdnProviderImageUrl(providerIdentifier: string): string {
      const cdnDomain = this.currentDomain.cdn;

      return `https://${cdnDomain}/providers/${providerIdentifier}/default/white.svg`;
    },

  },
});
