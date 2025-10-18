import type { ExtendedUserI } from "~/modules/users/domain/User";

type UserStoreI = {
  isAuthenticated: false | null; // null means the store has not been initialized yet, false means the user is not authenticated
  user: null;
} | {
  isAuthenticated: true;
  user: ExtendedUserI;
};

export default defineStore("user", {
  state: (): UserStoreI => ({
    isAuthenticated: null,
    user: null,
  }),

  actions: {
    async refreshUser() {
      const logger = useLogger();
      const user = useUserModule();
      const result = await user.queries.searchAuthenticatedUser.handle();
      if (result.isFailure) {
        logger.error("Error searching authenticated user inside user store", result.error);
      }

      // Remove previously logged in user
      if (result.isFailure || result.value === null) {
        this.isAuthenticated = false;
        this.user = null;
        return;
      }

      // Save logged in user
      this.isAuthenticated = true;
      this.user = { ...result.value };
      return;
    },
  },
});
