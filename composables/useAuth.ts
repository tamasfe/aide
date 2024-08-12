import { useFetch } from "#app";
import type {
  LoginCredentials,
  RegisterCredentialsBrazil,
  SignupFlow,
} from "~/types/auth";
import type { UserAccount } from "~/types/user";

const isAuthenticated = ref(false);

// TODO: translations for error messages
export function useAuth() {
  const register = async (credentials: RegisterCredentialsBrazil) => {
    const { error: flowError, data: flowData } = await useFetch<SignupFlow>(
      "http://localhost:3050/signup/flow",
      {
        headers: {
          "cf-ipcountry": "BR",
        },
      },
    );

    if (flowError.value || flowData.value === null) {
      return {
        message: "Sign Up failed please try again.",
        error: true,
      };
    }

    const { error: flowUpdateError } = await useFetch(
      `http://localhost:3050/signup/flow/${flowData.value.id_flow}`,
      {
        method: "PATCH",
        body: credentials,
      },
    );

    if (flowUpdateError.value) {
      return {
        message: "Sign Up failed please try again.",
        error: true,
      };
    }

    const { error: signupError } = await useFetch(
      `http://localhost:3050/signup/flow/${flowData.value.id_flow}`,
      {
        method: "POST",
        headers: {
          "cf-ipcountry": "BR",
        },
      },
    );

    if (signupError.value) {
      // TODO: use the error message from the server
      return {
        message: "Sign Up failed please try again.",
        error: true,
      };
    }

    return {
      message: "You have successfully signed up.",
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
    const { error, data } = await useFetch(
      "http://localhost:3050/auth/logout",
      {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
      },
    );
    if (error.value) {
      return null;
    }
    return data.value;
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

  return { login, logout, getUser, register, isAuthenticated };
}
