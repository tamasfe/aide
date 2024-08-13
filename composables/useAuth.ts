import type { FetchError } from "ofetch";
import { useFetch } from "#app";
import type {
  Flow,
  LoginCredentials,
  RegisterCredentialsBrazil,
  SignupFlow,
} from "~/types/auth";
import type { UserAccount } from "~/types/user";

const isAuthenticated = ref(false);

// TODO: translations for error messages
// TODO: use $fetch instead of useFetch
export function useAuth() {
  const getFlow = async (flowId: string) => {
    try {
      const data = await $fetch<Flow<RegisterCredentialsBrazil>>(
        `http://localhost:3050/signup/flow/${flowId}`,
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
      const flowData = await $fetch<SignupFlow>(
        "http://localhost:3050/signup/flow",
        {
          headers: {
            "cf-ipcountry": "BR",
          },
        },
      );
      flowId = flowData.id_flow;

      await $fetch(`http://localhost:3050/signup/flow/${flowData.id_flow}`, {
        method: "PATCH",
        body: credentials,
      });

      await $fetch(`http://localhost:3050/signup/flow/${flowData.id_flow}`, {
        method: "POST",
        headers: {
          "cf-ipcountry": "BR",
        },
      });
    }
    catch (e: unknown) {
      let message = "signup_try_again";
      const error = e as FetchError;
      if (error.data?.code === "VALIDATION") {
        message = error.data.metadata;
      }
      return {
        message: message,
        flow: flowId,
        error: true,
      };
    }

    return {
      message: "signup_success",
      flow: flowId,
      error: false,
    };
  };

  const login = async (credentials: LoginCredentials) => {
    // TODO: base path should be configurable?
    const { error } = await useFetch("http://localhost:3050/auth/login", {
      method: "POST",
      body: credentials,
      credentials: "include", // Ensure cookies are included in the request
    });

    if (error.value) {
      return false;
    }

    return true;
  };

  const logout = async () => {
    try {
      const data = await $fetch("http://localhost:3050/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
      });
      return data;
    }
    catch (e) {
      console.log(e);
    }
    return null;
  };

  const getUser = async () => {
    // necessary to include cookies in the request
    // for ssr to work
    const { error, data } = await useFetch<UserAccount>(
      "http://localhost:3050/auth/whoami",
      {
        credentials: "include", // Ensure cookies are included in the request
      },
    );
    if (error.value) {
      return null;
    }
    return data.value;
  };

  return { login, logout, getUser, register, getFlow, isAuthenticated };
}
