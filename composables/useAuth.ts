import type { FetchError } from "ofetch";
import { getValidationErrorTranslationKeys } from "~/utils";
import type { ValidationErrorMetadata } from "~/types/api";
import type {
  Flow,
  LoginCredentials,
  RegisterCredentialsBrazil,
  SignupFlow,
  WhoAmI,
} from "~/types/auth";

const useAuthenticatedState = () => useState("isAuthenticated", () => false);

// TODO: translations for error messages
// TODO: use $fetch instead of useFetch
export function useAuth() {
  // using ref directly outisde setup is dangerous because
  // cross headers pollution can happen
  const isAuthenticated = useAuthenticatedState();
  const config = useRuntimeConfig();

  const getFlow = async (flowId: string) => {
    try {
      const data = await $fetch<Flow<RegisterCredentialsBrazil>>(
        `/signup/flow/${flowId}`,
        {
          baseURL: config.public.apiBaseUrl,
        },
      );
      return data;
    }
    catch (error) {
      console.log(error);
    }
    return null;
  };

  const register = async (credentials: RegisterCredentialsBrazil) => {
    let flowId: null | string = null;
    try {
      const flowData = await $fetch<SignupFlow>("/signup/flow", {
        headers: {
          "cf-ipcountry": "BR",
        },
        baseURL: config.public.apiBaseUrl,
      });
      flowId = flowData.id_flow;

      await $fetch(`/signup/flow/${flowData.id_flow}`, {
        method: "PATCH",
        body: credentials,
        baseURL: config.public.apiBaseUrl,
      });

      await $fetch(`/signup/flow/${flowData.id_flow}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "cf-ipcountry": "BR",
        },
        baseURL: config.public.apiBaseUrl,
      });
    }
    catch (e: unknown) {
      let message = "signup_try_again";
      const error = e as FetchError;
      if (error.data?.code === "VALIDATION") {
        const metadata = error.data.metadata as ValidationErrorMetadata;
        const [firstErrorMessage] = getValidationErrorTranslationKeys(metadata);
        if (firstErrorMessage) {
          message = firstErrorMessage;
        }
      }
      return {
        message: message,
        flow: flowId,
        error: true,
      };
    }

    return {
      message: "auth.signup_success",
      flow: flowId,
      error: false,
    };
  };

  const login = async (credentials: LoginCredentials) => {
    // TODO: base path should be configurable?
    const { error } = await useFetch("/auth/login", {
      method: "POST",
      body: credentials,
      credentials: "include", // Ensure cookies are included in the request
      baseURL: config.public.apiBaseUrl,
    });

    console.log("logged in");

    if (error.value) {
      return false;
    }

    return true;
  };

  const logout = async () => {
    try {
      const data = await $fetch("/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
        baseURL: config.public.apiBaseUrl,
      });
      return data;
    }
    catch (e) {
      console.log(e);
    }
    return null;
  };

  const getUser = async () => {
    // As per the documentation, the cookie headers
    // must be explicitly passed to the useFetch call
    const headers = useRequestHeaders(["cookie"]);
    const { error, data } = await useFetch<WhoAmI>("/auth/whoami", {
      credentials: "include", // Ensure cookies are included in the request
      headers,
      baseURL: config.public.apiBaseUrl,
    });
    if (error.value) {
      return null;
    }
    return data.value;
  };

  return { login, logout, getUser, register, getFlow, isAuthenticated };
}
