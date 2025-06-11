import type { SiteResponse } from "~/modules/sites/domain/Site";
import type { License } from "~/modules/sites/domain/License";
import { ErrorAnjouanLicenseScriptWasNotFound } from "~/packages/licenses/ErrorAnjouanLicenseScriptWasNotFound";
import { ErrorInitiatingAnjouanLicenseScript } from "~/packages/licenses/ErrorInitiatingAnjouanLicenseScript";
import type { LoggerI } from "~/packages/logger/Logger";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

type Domain = SiteResponse["domain"];
type Site = SiteResponse["site"];

const domainForLocalDevelopment: Domain = { api: "localhost:3050", email: "girobet.vip", frontend: "localhost:3001", cdn: "cdn.girobet.vip", tracking: "localhost:3335" };
const siteForLocalDevelopment: Site = {
  identifier: "girobet",
  name: "GiroBet",
  servable: true,
};

export const useSiteStore = defineStore("siteStore", {
  state(): {
    licenses: License[];
    site: Site | null;
    domain: Domain | null;
  } {
    return {
      site: null,
      domain: null,
      licenses: [],
    };
  },

  getters: {
    currentDomain(state): Domain {
      return state.domain || this.getFallbackDomain;
    },

    currentSite(state): Site {
      return state.site || {
        identifier: "bloqued",
        name: "Bloqued",
        servable: false,
      };
    },

    supportEmail(): string {
      return `support@${this.currentDomain.email}`;
    },

    getFallbackDomain(): Domain {
      const url = useRequestURL();
      const domainWithoutSubdomains = url.hostname.split(".").slice(-2).join(".");
      return {
        api: `api.${domainWithoutSubdomains}`,
        email: domainWithoutSubdomains,
        frontend: domainWithoutSubdomains,
        cdn: `cdn.${domainWithoutSubdomains}`,
        tracking: `4.${domainWithoutSubdomains}`,
      };
    },
  },

  actions: {
    async setup(
      dependencies: {
        logger: LoggerI;
        findMatchedSite: () => Promise<Result<SiteResponse, InfrastructureError>>;
        findMatchedLicenses: () => Promise<Result<License[], InfrastructureError>>;
      },
    ) {
      const [resultFindingSite, resultFindingLicenses] = await Promise.all([
        dependencies.findMatchedSite(),
        dependencies.findMatchedLicenses(),
      ]);
      if (resultFindingSite.isFailure) {
        dependencies.logger.error("Error searching for current site, loading default Girobet one in order to not break the site", resultFindingSite.error);
        return;
      }

      if (resultFindingLicenses.isFailure) {
        dependencies.logger.error("Error searching for licenses, loading default Girobet one in order to not break the site", resultFindingLicenses.error);
        this.$state = { domain: resultFindingSite.value.domain, site: resultFindingSite.value.site, licenses: [] };
        return;
      }

      // dependencies.logger.info("Site found", { site: resultFindingSite.value.site, domain: resultFindingSite.value.domain, licenses: resultFindingLicenses.value });
      if (resultFindingSite.value.site.identifier.toLowerCase() === "localhost") {
        this.$state = { domain: { ...domainForLocalDevelopment }, site: siteForLocalDevelopment, licenses: resultFindingLicenses.value };
        return;
      }

      this.$state = { domain: resultFindingSite.value.domain, site: resultFindingSite.value.site, licenses: resultFindingLicenses.value };
    },

    getAssetPath(path: string) {
      return `/assets/${this.currentSite.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
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
      switch (this.currentSite.identifier) {
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
      const baseImagePath = `/games/${gameIdentifier}.jpg`;

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
