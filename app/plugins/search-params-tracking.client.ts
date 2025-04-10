export default defineNuxtPlugin({
  name: "search-params-tracking",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const { searchParams } = useRequestURL();

    const resultStoring = $dependencies.searchParamsTracking.storeMarketingSearchParams.handle(searchParams);
    if (resultStoring.isFailure) {
      $dependencies.common.logger.error("Error storing the user's search parameters to later attribute their marketing. Even if we tolerate it, this is critical for the costs of the company", resultStoring.error);
    }

    return {};
  },
});
