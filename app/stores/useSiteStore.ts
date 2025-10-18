import type { SiteResponse } from "~/modules/sites/domain/Site";
import type { License } from "~/modules/sites/domain/License";
import { ErrorAnjouanLicenseScriptWasNotFound } from "~/packages/licenses/ErrorAnjouanLicenseScriptWasNotFound";
import { ErrorInitiatingAnjouanLicenseScript } from "~/packages/licenses/ErrorInitiatingAnjouanLicenseScript";
import type { LoggerI } from "~/packages/logger/Logger";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

type Domain = SiteResponse["domain"];
type Site = SiteResponse["site"];

const domainForLocalDevelopment: Domain = { api: "localhost:3050", email: "girobet.vip", frontend: "localhost:3000", cdn: "cdn.girobet.vip", tracking: "localhost:3335" };
const siteForLocalDevelopment: Site = {
  id: 1,
  identifier: "zambabet",
  name: "ZambaBet",
  servable: true,
};

type AnjouanLicenseData = {
  windowInitMethod: string;
  divData: {
    id: string;
    anjSealId: string;
  };
};

export default defineStore("site", {
  state(): {
    licenses: License[];
    site: Site;
    domain: Domain;
  } {
    return {
      // Initialized with dummy values to avoid null checks everywhere as
      // the store is expected to be setup before being used
      site: null as unknown as Site,
      domain: null as unknown as Domain,
      licenses: [],
    };
  },

  getters: {
    currentDomain(state): Domain {
      return state.domain || this.getFallbackDomain;
    },

    currentSite(state): Site {
      return state.site || {
        id: 0,
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

    activeAnjouanLicenseData(): AnjouanLicenseData | null {
      switch (this.currentSite.identifier) {
        case "zambabet": {
          const ZAMBABET_SEAL_ID = "baee18f7-63ae-4aa0-b5d7-8160149e921b";
          return {
            windowInitMethod: "anj_baee18f7_63ae_4aa0_b5d7_8160149e921b" as const,
            divData: {
              id: `anj-${ZAMBABET_SEAL_ID}`,
              anjSealId: ZAMBABET_SEAL_ID,
            },
          };
        }

        case "girobet": {
          const GIROBET_SEAL_ID = "950afe10-5e7e-4fa8-9bef-21380e8558b3";
          return {
            windowInitMethod: "anj_950afe10_5e7e_4fa8_9bef_21380e8558b3" as const,
            divData: {
              id: `anj-${GIROBET_SEAL_ID}`,
              anjSealId: GIROBET_SEAL_ID,
            },
          };
        }

        default:
          return null;
      }
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
        throw resultFindingSite.error;
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

    getRelativeAssetPath(path: string) {
      return `/assets/${this.currentSite.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
    },
    getCdnPath(path: string) {
      return `https://${this.currentDomain.cdn}${path.startsWith("/") ? path : `/${path}`}`;
    },

    getActiveLicense(): License {
      const activeLicense = this.licenses[0]; // We return the first one as the backend returns them in order of priority
      if (!activeLicense) {
        throw new Error("No active license found. This should never happen as the site should either have a valid license or have thrown an invalid jurisdiction error");
      }
      return activeLicense;
    },

    activateAnjouanLicenseIfAvailable() {
      const logger = useLogger();

      const activeLicenseData = this.activeAnjouanLicenseData;
      if (!activeLicenseData) {
        return;
      }

      // @ts-expect-error it's correct
      const initMethodObject = window[activeLicenseData.windowInitMethod];
      if (!initMethodObject || typeof initMethodObject !== "object" || false === "init" in initMethodObject || typeof initMethodObject.init !== "function") {
        logger.error("Anjouan script not loaded properly.", new ErrorAnjouanLicenseScriptWasNotFound("The Anjouan license script was not found on the window object."));
        return;
      }

      try {
        initMethodObject.init();
      }
      catch (error) {
        logger.error("Anjouan script could not be initialized.", new ErrorInitiatingAnjouanLicenseScript("The Anjouan license script returned an error", { }, ErrorInitiatingAnjouanLicenseScript.parseCause(error)));
      }
      return;
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
