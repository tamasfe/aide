import type { UserSettingSimplifiedI } from "~/modules/users/application/SearchUserSettingsSimplified";

type UserSettingsStoreI = {
  isInit: false;
  settings: null;
} | {
  isInit: true;
  settings: UserSettingSimplifiedI;
};

export const useUserSettingsStore = defineStore("userSettingsStore", {
  state: (): UserSettingsStoreI => ({
    isInit: false,
    settings: null,
  }),

  actions: {
    async refresh() {
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.users.queries.searchUserSettingsSimplified.handle();
      if (result.isFailure) {
        $dependencies.common.logger.error("Error searching authenticated user settings inside store", result.error);
      }

      // Remove previous state
      if (result.isFailure || result.value === null) {
        this.isInit = false;
        this.settings = null;
        return;
      }

      // Save state
      this.isInit = true;
      this.settings = result.value;
      return;
    },

  },
});
