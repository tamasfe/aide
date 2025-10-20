export default defineNuxtPlugin({
  name: "gtm",
  parallel: true,
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const siteStore = useSiteStore();
    const { proxy } = useScriptGoogleAnalytics();

    watch(
      () => userStore.isAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated === true) {
          if (!userStore.user) {
            return;
          }
          proxy.gtag("event", "LOGIN", {
            user_id: String(userStore.user.id),
            brand_id: siteStore.currentSite.id,
          });
        }
        else if (isAuthenticated === false) {
          proxy.gtag("event", "LOGOUT", {
            user_id: String(userStore.user?.id || ""),
            brand_id: siteStore.currentSite.id,
          });
        }
      },
    );

    nuxtApp.hook("frontend:event:signup-flow:submitted", async () => {
      proxy.gtag("event", "SIGNUP", {
        user_id: String(userStore.user?.id || ""),
        brand_id: siteStore.currentSite.id,
      });
    });

    nuxtApp.hook("frontend:event:payment:deposit:created", async ({ amount, currency, totalDeposits }) => {
      proxy.gtag("event", "DEPOSIT_INITIATED", {
        user_id: String(userStore.user?.id || ""),
        brand_id: siteStore.currentSite.id,
        amount,
        currency,
        deposit_count: totalDeposits,
      });
    });

    nuxtApp.hook("frontend:event:payment:withdrawal:created", async ({ amount, currency, totalWithdrawals }) => {
      proxy.gtag("event", "WITHDRAWAL_INITIATED", {
        user_id: String(userStore.user?.id || ""),
        brand_id: siteStore.currentSite.id,
        amount,
        currency,
        withdrawal_count: totalWithdrawals,
      });
    });

    nuxtApp.hook("backend:event:tracker:payment-updated", async (event) => {
      if (event.status === "succeeded") {
        if (event.paymentType === "deposit") {
          proxy.gtag("event", "DEPOSIT_SUCCEEDED", {
            user_id: String(userStore.user?.id || ""),
            brand_id: siteStore.currentSite.id,
            amount: event.amount,
            currency: event.currency,
            deposit_count: event.statusCounts.succeeded,
          });
        }
        if (event.paymentType === "withdrawal") {
          proxy.gtag("event", "WITHDRAWAL_SUCCEEDED", {
            user_id: String(userStore.user?.id || ""),
            brand_id: siteStore.currentSite.id,
            amount: event.amount,
            currency: event.currency,
            withdrawal_count: event.statusCounts.succeeded,
          });
        }
      }
    });
  },
});
