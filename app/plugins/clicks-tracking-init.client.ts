const OPEN_MODAL_SEARCH_PARAM = "open";

export default defineNuxtPlugin({
  name: "search-params-tracking",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const { searchParams } = useRequestURL();
    const userStore = useUserStore();
    const route = useRoute();

    const copyOfSearchParams = new URLSearchParams(searchParams); // In case deleting the route.query params somehow modified the original searchParams in a weird race-condition way.

    /**
     * We do not want to await this as loading the Fingerprint dependencies is quite thick.
     * By using a callback we ensure to not block the main thread while the browser loads the dependencies.
     */
    $dependencies.clicks.ui.createTrackingClick.handle(
      userStore.user?.id || null,
      route.path,
      copyOfSearchParams,
    ).then((resultCreatingClick) => {
      if (resultCreatingClick.isFailure) {
        $dependencies.common.logger.error("!! Error creating the click in the tracking system", resultCreatingClick.error);
      }
    });

    const resultStoring = $dependencies.clicks.ui.storeMarketingSearchParams.handle(copyOfSearchParams);
    if (resultStoring.isFailure) {
      $dependencies.common.logger.error("Error storing the user's search parameters to later attribute their marketing. Even if we tolerate it, this is critical for the costs of the company", resultStoring.error);
    }

    /*
    *  Identify the user when they log in or sign up to the current tracking session.
    */
    watch(() => userStore.user?.id, async (newUserId) => {
      if (newUserId) {
        await $dependencies.clicks.ui.updateTrackingSession.handle(newUserId);
      }
    });

    nuxtApp.hook("page:finish", async () => {
      await callOnce("handle-open-modal-search-param", async () => {
        const openModalSearchParam = searchParams.get(OPEN_MODAL_SEARCH_PARAM) || null;
        await $dependencies.clicks.ui.handleOpenModalSearchParam.handle(openModalSearchParam, userStore.isAuthenticated ?? false);
      });
    });

    /*
    *  Once we have done everything we want to with them, we remove search params from the URL without navigating for aesthetic reasons
    */
    for (const [key] of searchParams.entries()) {
      if (key === OPEN_MODAL_SEARCH_PARAM) {
        continue; // We want to keep this one as it is used to open modals.
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete route.query[key];
    }

    return {};
  },
});
