import { createGtm, GtmSupport, useGtm } from "@gtm-support/vue-gtm";

type GtmEvent =
  | "LOGIN"
  | "LOGOUT"
  | "SIGNUP"
  | "DEPOSIT_INITIATED"
  | "WITHDRAWAL_INITIATED"
  | "DEPOSIT_SUCCEEDED"
  | "WITHDRAWAL_SUCCEEDED";

/**
 * Safely-typed util function to fire our GiroBet GTM events.
 * Take into account that the variable names are not to be changed here, they need to match the GTM data layer variable names
 * specified in the GTM container.
 */
const fireGtmEvent = <E extends GtmEvent>(
  gtm: NonNullable<InstanceType<typeof GtmSupport>>,
  event: E,
  data: E extends "LOGIN" | "LOGOUT" | "SIGNUP"
    ? { user_id: string }
    : E extends "DEPOSIT_INITIATED" | "DEPOSIT_SUCCEEDED"
    ? {
      amount_decimal: number;
      currency: string;
      user_id: string;
      deposit_count: number;
    }
    : E extends "WITHDRAWAL_INITIATED" | "WITHDRAWAL_SUCCEEDED"
    ? {
      amount_decimal: number;
      currency: string;
      user_id: string;
      withdrawal_count: number;
    }
    : never
) => {
  gtm.push({
    event,
    value: "amount_decimal" in data ? data.amount_decimal : null,
    ...data,
    // label: to define
    // action: to define
    // category: to define
  });
};

export default defineNuxtPlugin({
  name: "package-google-tag-manager",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const { $dependencies } = useNuxtApp();
    const publicConfig = useRuntimeConfig().public;

    nuxtApp.vueApp.use(
      createGtm({
        ...publicConfig.gtm,
      })
    );

    watch(
      () => userStore.isAuthenticated,
      (isAuthenticated) => {
        const gtm = useGtm();
        if (!gtm) {
          return;
        }

        if (isAuthenticated === true) {
          if (!userStore.user) {
            return;
          }
          fireGtmEvent(gtm, "LOGIN", { user_id: String(userStore.user.id) });
        } else if (isAuthenticated === false) {
          fireGtmEvent(gtm, "LOGOUT", {
            user_id: String(userStore.user?.id || ""),
          });
        }
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:signup-flows:signup-flow-submitted",
      async () => {
        const gtm = useGtm();
        if (!gtm) {
          return;
        }
        fireGtmEvent(gtm, "SIGNUP", {
          user_id: String(userStore.user?.id || ""),
        });
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:payments:deposit-flow-created",
      async ({ amount, currency, totalDeposits }) => {
        const gtm = useGtm();
        if (!gtm) {
          return;
        }
        fireGtmEvent(gtm, "DEPOSIT_INITIATED", {
          amount_decimal: amount,
          deposit_count: totalDeposits,
          currency,
          user_id: String(userStore.user?.id || ""),
        });
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:payments:withdrawal-flow-created",
      async ({ amount, currency, totalWithdrawals }) => {
        const gtm = useGtm();
        if (!gtm) {
          return;
        }
        fireGtmEvent(gtm, "WITHDRAWAL_INITIATED", {
          amount_decimal: amount,
          withdrawal_count: totalWithdrawals,
          currency,
          user_id: String(userStore.user?.id || ""),
        });
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:tracker:payment-updated",
      async (event) => {
        const gtm = useGtm();
        if (!gtm) {
          return;
        }

        if (event.status === "succeeded") {
          if (event.paymentType === "deposit") {
            fireGtmEvent(gtm, "DEPOSIT_SUCCEEDED", {
              amount_decimal: event.amount,
              deposit_count: event.statusCounts.succeeded,
              currency: event.currency,
              user_id: String(userStore.user?.id || ""),
            });
          }
          if (event.paymentType === "withdrawal") {
            fireGtmEvent(gtm, "WITHDRAWAL_SUCCEEDED", {
              amount_decimal: event.amount,
              withdrawal_count: event.statusCounts.succeeded,
              currency: event.currency,
              user_id: String(userStore.user?.id || ""),
            });
          }
        }
      }
    );
  },
});
