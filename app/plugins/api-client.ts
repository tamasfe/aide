import createClient, { type Client, type Middleware } from "openapi-fetch";
import type { paths } from "../packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import { EmitCommandOpenUserActionModalModal } from "~/modules/users/infra/ui/EmitCommandOpenUserActionModal";
import { HttpBackendApiError } from "../packages/http-client/http-backend-api-error";
import { ErrorFailedToFetch } from "../packages/http-client/error-failed-to-fetch";
import type { SupportedLocale } from "../packages/translation";
import type { NuxtApp } from "#app";

export type ApiClient = Client<paths, `${string}/${string}`>;

// Why do we use a plugin instad of a composable?
// Because we want to have a single instance of the API client
// and we want to configure it only once, with the middlewares
// and the base URL depending on the environment (server or client).
// A composable would create a new instance every time it is called,
// or we would have to introduce logic to cache the instance.
export default defineNuxtPlugin({
  name: "api-client",
  parallel: true,
  async setup() {
    const { hostname } = useRequestURL();
    const nuxtApp = useNuxtApp();

    let apiClient: ApiClient;

    if (import.meta.server) {
      const requestHeaders = useRequestHeaders();

      apiClient = createClient<paths>({ baseUrl: nuxtApp.$config.apiBaseUrl, credentials: "include", headers: {
        "Content-Type": "application/json",
        "X-Forwarded-Host": requestHeaders?.host,
        ...requestHeaders,
      } });
    }
    else {
      const siteStore = useSiteStore();

      apiClient = createClient<paths>({ baseUrl: `${nuxtApp.$config.public.apiClientProtocol}${siteStore.currentDomain.api}`, credentials: "include", headers: {
        "Content-Type": "application/json",
      } });
    }

    apiClient.use(
      createMiddlewareJurisdictionErrorHandler(
        nuxtApp,
        hostname,
        nuxtApp.$i18n.locale.value,
      ),
      createMiddlewareCorsErrorHandler(),
    );

    return {
      provide: {
        apiClient,
      },
    };
  },
});

function createMiddlewareJurisdictionErrorHandler(nuxtApp: NuxtApp, hostname: string, locale: SupportedLocale): Middleware {
  const emitOpenUserModal = new EmitCommandOpenUserActionModalModal(nuxtApp);

  return {
    async onResponse({ response }) {
      /* If a CORS error happens, the response may be null or undefined */
      if (!response) {
        return;
      }

      if (response.ok || !response.headers.get("content-type")?.includes("application/json")) {
        return;
      }

      const jsonResponse: unknown = await response.clone().json();
      if (HttpBackendApiError.isJurisdictionError(jsonResponse)) {
        switch (jsonResponse.code) {
          case "JURISDICTION_NOT_SUPPORTED_NO_ALTERNATIVE_SITE":
            await emitOpenUserModal.handle({ modal: "restrict_license_no_alternative", data: {
              jurisdiction: jsonResponse.metadata.jurisdiction,
              currentHost: hostname,
              blockedCountry: useCountryName(jsonResponse.metadata.jurisdiction, locale) || jsonResponse.metadata.jurisdiction,
            } });
            return;

          case "JURISDICTION_NOT_SUPPORTED_ALTERNATIVE_SITE": {
            const allowedUrl = jsonResponse.metadata.alternative_site.domain.frontend ? `https://${jsonResponse.metadata.alternative_site.domain.frontend}` : null;
            if (!allowedUrl) {
              await emitOpenUserModal.handle({ modal: "restrict_license_no_alternative", data: {
                jurisdiction: jsonResponse.metadata.jurisdiction,
                currentHost: hostname,
                blockedCountry: useCountryName(jsonResponse.metadata.jurisdiction, locale) || jsonResponse.metadata.jurisdiction,
              } });
              return;
            }

            await emitOpenUserModal.handle({
              modal: "restrict_license_alternative",
              data: {
                jurisdiction: jsonResponse.metadata.jurisdiction,
                allowedUrl,
                currentHost: hostname,
                blockedCountry: useCountryName(jsonResponse.metadata.jurisdiction, locale) || jsonResponse.metadata.jurisdiction,
              },
            });
            return;
          }

          case "USER_ACCOUNT_JURISDICTION_MISMATCH":
            await emitOpenUserModal.handle({
              modal: "restrict_license_no_alternative",
              data: {
                jurisdiction: jsonResponse.metadata.jurisdiction,
                currentHost: hostname,
                blockedCountry: useCountryName(jsonResponse.metadata.jurisdiction, locale) || jsonResponse.metadata.jurisdiction,
              },
            });
            return;

          case "JURISDICTION_SUPPORTED_BUT_NOT_ENABLED":
            await emitOpenUserModal.handle({
              modal: "restrict_expanding",
              data: {
                jurisdiction: jsonResponse.metadata.jurisdiction,
                currentHost: hostname,
                blockedCountry: useCountryName(jsonResponse.metadata.jurisdiction, locale) || jsonResponse.metadata.jurisdiction,
              },
            });
            return;

          default:
            return;
        }
      }
    },
  };
};

const createMiddlewareCorsErrorHandler: () => Middleware = () => {
  return {
    onError({ error, request, id, params }) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          return ErrorFailedToFetch.newWithCause(request.url, error, { request: { id, params } });
        }
      }
      return;
    },
  };
};
