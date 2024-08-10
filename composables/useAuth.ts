// ~/composables/useAuth.js
import { useFetch } from "#app";
import type { UserAccount } from "~/types/user";

type Credentials = {
  username: string;
  password: string;
};

export function useAuth() {
  const login = async (credentials: Credentials) => {
    // TODO: base path should be configurable?
    const response = await useFetch("http://localhost:3050/auth/login", {
      method: "POST",
      body: credentials,
      credentials: "include", // Ensure cookies are included in the request
    });

    if (response.error.value) {
      console.error("Login failed", response.error);
    }
    else {
      console.log("Login successful");
    }
    return response;
  };

  const logout = async () => {
    await useFetch("http://localhost:3050/auth/logout", {
      method: "POST",
      credentials: "include", // Ensure cookies are included in the request
    });

    console.log("Logged out successfully");
  };

  const getUser = async () => {
    // necessary to include cookies in the request
    // for ssr to work
    const { error, data } = await useFetch<UserAccount>(
      "http://localhost:3050/user/profile",
      {
        credentials: "include", // Ensure cookies are included in the request
      },
    );
    if (error.value) {
      console.error("User is not authenticated", error.value);
      return null;
    }
    return data.value;
  };

  return { login, logout, getUser };
}
