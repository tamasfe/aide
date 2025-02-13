type SiteStoreI = {
  identifier: string;
  name: string;
  supportEmail: string;
};

const defaultSite = {
  identifier: "girobet",
  name: "GiroBet",
  supportEmail: "support@girobet.com",
};

export const useSiteStore = defineStore("siteStore", {
  state: (): SiteStoreI => ({
    ...defaultSite,
  }),

  actions: {
    async refresh() {
      // const { $dependencies } = useNuxtApp();
      // const result = await $dependencies.users.queries.searchAuthenticatedUser.handle();
      // if (result.isFailure) {
      //   $dependencies.common.logger.error("Error searching for current site, loading default Girobet one", result.error);
      //   this.site = { ...defaultSite };
      //   return;
      // }

    },

    getAssetPath(path: string) {
      return `/assets/${this.identifier}/${path.startsWith("/") ? path.slice(1) : path}`;
    },
  },
});
