export default defineNuxtPlugin({
  name: "module-signup-flows-initiator",
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
      "frontend:events:signup-flows:signup-flow-submitted",
      () => $dependencies.signupFlows.ui.deleteCurrentSignupFlowIdOnSignupFlowSubmitted.handle(),
    );

    return {};
  },
});
