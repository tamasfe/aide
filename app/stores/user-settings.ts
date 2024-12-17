import type { SearchUserSettingsResponseI } from "~/modules/users/application/SearchUserSettingsSimplified";

type Status = "ready" | "loading" | "unititialized";
type UserSettingsStoreI = {
  status: "unititialized" | "loading";
  settings: null;
} | {
  status: Status;
  settings: SearchUserSettingsResponseI;
};

export const useUserSettingsStore = defineStore("userSettingsStore", {
  state: (): UserSettingsStoreI => ({
    status: "unititialized",
    settings: null,
  }),

  actions: {
    async refresh() {
      this.status = "loading";
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.users.queries.searchUserSettingsSimplified.handle();
      if (result.isFailure) {
        $dependencies.common.logger.error("Error searching authenticated user settings inside store", result.error);
      }

      // Remove previous state
      if (result.isFailure || result.value === null) {
        this.status = "unititialized";
        this.settings = null;
        return;
      }

      // Save state
      this.status = "ready";
      this.settings = result.value;
      return;
    },

  },
});
