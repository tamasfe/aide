const OPEN_MODAL_SEARCH_PARAM = "o";

export default defineNuxtPlugin({
  name: "tracking",
  parallel: true,
  dependsOn: ["site"],
  async setup(nuxtApp) {
    const { searchParams } = useRequestURL();
    const userStore = useUserStore();
    const route = useRoute();
    const trackingModule = useClickTrackingModule();
    const logger = useLogger();

    const copyOfSearchParams = new URLSearchParams(searchParams); // In case deleting the route.query params somehow modified the original searchParams in a weird race-condition way.

    /**
     * We do not want to await this as loading the Fingerprint dependencies is quite thick.
     * By using a callback we ensure to not block the main thread while the browser loads the dependencies.
     */
    trackingModule.ui.createTrackingClick.handle(
      userStore.user?.id || null,
      route.path,
      copyOfSearchParams,
    ).then((resultCreatingClick) => {
      if (resultCreatingClick.isFailure) {
        logger.error("!! Error creating the click in the tracking system", resultCreatingClick.error);
      }
    });

    const resultStoring = trackingModule.ui.storeMarketingSearchParams.handle(copyOfSearchParams);

    if (resultStoring.isFailure) {
      logger.error("Error storing the user's search parameters to later attribute their marketing. Even if we tolerate it, this is critical for the costs of the company", resultStoring.error);
    }

    /*
    *  Identify the user when they log in or sign up to the current tracking session.
    */
    watch(() => userStore.user?.id, async (newUserId) => {
      if (newUserId) {
        await trackingModule.ui.updateTrackingSession.handle(newUserId);
      }
    });

    await trackingModule.ui.setUsersPreviousActivity(new Date().toISOString());

    nuxtApp.hook("frontend:events:users:user-logged-in", async () => {
      await trackingModule.ui.setUsersPreviousActivity(new Date().toISOString());
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
