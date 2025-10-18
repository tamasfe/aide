const OPEN_MODAL_SEARCH_PARAM = "o";

export default defineNuxtPlugin({
  name: "query-control",
  parallel: true,
  dependsOn: ["site", "user"],
  async setup(nuxtApp) {
    const { searchParams } = useRequestURL();
    const userStore = useUserStore();
    const trackingModule = useClickTrackingModule();

    nuxtApp.hook("page:finish", async () => {
      const openModalSearchParam = searchParams.get(OPEN_MODAL_SEARCH_PARAM) || null;
      await trackingModule.ui.handleOpenModalSearchParam.handle(openModalSearchParam, userStore.isAuthenticated ?? false);
    });

    return {};
  },
});
