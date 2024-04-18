import { defineStore } from "pinia";

export const useAuthStore = defineStore("authorization", {
  state: () => ({
    isAuthorized: false,
  }),
  getters: {
    getAuthorizationState: state => state.isAuthorized,
  },
  actions: {
    setAuthorizationState(isAuthorized) {
      this.isAuthorized = isAuthorized;
    },
  },
});
