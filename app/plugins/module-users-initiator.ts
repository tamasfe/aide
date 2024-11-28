export default defineNuxtPlugin({
  name: "module-users-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const userStore = useUserStore();

    /**
     *
     * Event listeners
     *
     */
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-in",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-out",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-settings-updated",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:password-recovered",
      () => $dependencies.users.ui.emitCommandOpenUserActionModal.handle("login"),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:signup-flows:signup-flow-submitted",
      () => userStore.refreshUser(),
    );

    /**
     *
     * Init user pinia store
     *
     */
    await useAsyncData("user-authentication", () => userStore.refreshUser().then(() => true));

    return {};
  },
});
