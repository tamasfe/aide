export default defineNuxtPlugin({
  name: "module-notifications-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const notificationsStore = useNotificationsStore();

    /**
     *
     * Show unread notifications
     *
     */
    const ENABLE_SERVER_SIDE_RENDERING = false;
    const DEFER_CLIENT_SIDE_LOADING = true;
    await useAsyncData("unread-toast-notifications", () =>
      $dependencies.notifications.ui.searchLastUnreadNotificationToasts.handle()
        .then(notifications => notifications.map(notification => notificationsStore.showToast(notification)))
    , { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
    );

    /**
     *
     * Event listeners
     *
     */
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:backend-notification-received",
      ({ notification }) => $dependencies.notifications.ui.showNotificationToastToStoreFromWebsocketBackendNotification.handle(notification),
    );

    return {};
  },
});
