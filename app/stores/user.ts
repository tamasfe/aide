type UserStoreI = {
  isAuthenticated: false;
  user: null;
} | {
  isAuthenticated: true;
  user: {
    id: number;
    locale: string;
    timeZone: string;
  };
};

export const useUserStore = defineStore("userStore", {
  state: (): UserStoreI => ({
    isAuthenticated: false,
    user: null,
  }),

  actions: {
    async refreshAuthenticatedUser() {
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.users.queries.searchAuthenticatedUser.handle();
      if (result.isFailure) {
        $dependencies.common.logger.error("Error searching authenticated user inside user store", { error: result.error });
        return false;
      }

      if (result.value === null) {
        this.isAuthenticated = false;
        this.user = null;
        return false;
      }

      this.isAuthenticated = true;
      this.user = {
        id: result.value.id,
        locale: result.value.locale,
        timeZone: result.value.timeZone,
      };
      return true;
    },
  },
});
