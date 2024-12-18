import type { SupportedLocale } from "~/packages/translation";

type UserStoreI = {
  isAuthenticated: false | null; // null means the store has not been initialized yet, false means the user is not authenticated
  user: null;
} | {
  isAuthenticated: true;
  user: {
    id: number;
    locale: SupportedLocale | null;
    timeZone: string;
    email: string;
    cpf: string | null;
    phone: {
      value: string;
      prefix: {
        value: string;
        countryCode: string;
      };
    };
  };
};

export const useUserStore = defineStore("userStore", {
  state: (): UserStoreI => ({
    isAuthenticated: null,
    user: null,
  }),

  actions: {
    async refreshUser() {
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.users.queries.searchAuthenticatedUser.handle();
      if (result.isFailure) {
        $dependencies.common.logger.error("Error searching authenticated user inside user store", result.error);
      }

      // Remove previously logged in user
      if (result.isFailure || result.value === null) {
        this.isAuthenticated = false;
        this.user = null;
        return;
      }

      // Save logged in user
      this.isAuthenticated = true;
      this.user = result.value;
      return;
    },
  },
});
