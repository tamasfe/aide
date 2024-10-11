export default defineNuxtPlugin({
  name: "module-users-initiator",
  dependsOn: ["dependency-injection"],
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

    /**
     *
     * Init user pinia store
     *
     */
    await useAsyncData("user-authentication", () => userStore.refreshUser().then(() => true));

    return {};
  },
});
