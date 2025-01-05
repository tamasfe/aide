export default defineNuxtPlugin({
  name: "module-notifications-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();

    /**
     *
     * Event listeners
     *
     */
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:payments:payment-status-updated",
      data => $dependencies.notifications.ui.passNotificationToastToStoreFromPaymentUpdated.handle(data),
    );

    return {};
  },
});
