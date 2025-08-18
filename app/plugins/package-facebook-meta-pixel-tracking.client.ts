export default defineNuxtPlugin({
  name: "package-facebook-meta-events",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup() {
    const { $dependencies } = useNuxtApp();

    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:signup-flows:signup-flow-submitted",
      async () => {
        const { $fbq } = useNuxtApp();
        $fbq("track", "CompleteRegistration");
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:payments:deposit-flow-created",
      async ({ amount, currency }) => {
        const { $fbq } = useNuxtApp();
        $fbq("track", "InitiateCheckout", {
          value: amount,
          currency: currency,
        });
      }
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:tracker:payment-updated",
      async (event) => {
        const { $fbq } = useNuxtApp();

        if (event.status === "succeeded") {
          if (event.paymentType === "deposit") {
            $fbq("track", "Purchase", {
              currency: event.currency,
              value: event.amount,
            });
          }
        }
      }
    );
  },
});
