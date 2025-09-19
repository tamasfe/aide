export default defineNuxtPlugin({
  name: "module-signup-flows-initiator",
  dependsOn: ["module-users-initiator"],
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
      "frontend:events:signup-flows:signup-flow-submitted",
      () => $dependencies.signupFlows.ui.deleteCurrentSignupFlowIdOnSignupFlowSubmitted.handle(),
    );

    watch(() => userStore.isAuthenticated, async (isAuthenticated) => {
      if (!isAuthenticated) {
        await $dependencies.signupFlows.ui.startSignupFlowOnInitAnonymousUser.handle();
      }
    }, { immediate: true });

    return {};
  },
});
