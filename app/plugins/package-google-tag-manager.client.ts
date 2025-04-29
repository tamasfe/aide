export default defineNuxtPlugin({
  name: "package-google-tag-manager",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const userStore = useUserStore();
    const { $dependencies } = useNuxtApp();

    /**
     * login & logout GTM triggers
     */
    watch(() => userStore.isAuthenticated, (isAuthenticated) => {
      const gtm = useGtm();
      if (!gtm) {
        return;
      }

      if (isAuthenticated === true) {
        if (!userStore.user) {
          return;
        }
        gtm.trackEvent({ event: "LOGIN", user_id: String(userStore.user.id) });
      }
      else if (isAuthenticated === false) {
        gtm.trackEvent({ event: "LOGOUT", userId: "" });
      }
    });

    /**
     * signup GTM trigger
     */
    $dependencies.common.asyncMessagePublisher.subscribe("girobet:events:signup-flows:signup-flow-submitted", async () => {
      const gtm = useGtm();
      if (!gtm) {
        return;
      }
      gtm.trackEvent({ event: "SIGNUP" });
    });

    /**
     * deposit & withdrawal GTM triggers
     */
    $dependencies.common.asyncMessagePublisher.subscribe("girobet:events:payments:deposit-flow-created", async ({ amount, currency }) => {
      const gtm = useGtm();
      if (!gtm) {
        return;
      }
      gtm.trackEvent({ event: "DEPOSIT_INITIATED", amount_decimal: amount, currency, user_id: String(userStore.user?.id || "") });
    });

    $dependencies.common.asyncMessagePublisher.subscribe("girobet:events:payments:withdrawal-flow-created", async ({ amount, currency }) => {
      const gtm = useGtm();
      if (!gtm) {
        return;
      }
      gtm.trackEvent({ event: "WITHDRAWAL_INITIATED", amount_decimal: amount, currency, user_id: String(userStore.user?.id || "") });
    });
  },
});
