import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "module-users-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const userStore = useUserStore();
    const userSettingsStore = useUserSettingsStore();

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
      "girobet:events:users:user-logged-in",
      () => userSettingsStore.refresh(),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-out",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-out",
      () => userSettingsStore.refresh(),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-settings-updated",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-settings-updated",
      () => userSettingsStore.refresh(),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:password-recovered",
      () => $dependencies.users.ui.emitCommandOpenUserActionModal.handle("login"),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:signup-flows:signup-flow-submitted",
      () => userStore.refreshUser(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:signup-flows:signup-flow-submitted",
      () => userSettingsStore.refresh(),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:payments:deposit-flow-created",
      ({ flowId, code, amount, currency, paymentMethodId }) => $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: "deposit_confirm", data: { flowId, paymentCode: code, amount, currency, paymentMethodId } }),
    );

    /**
     *
     * Init user pinia store
     *
     */
    await useAsyncData("user-authentication", () =>
      userStore.refreshUser()
        .then(() => true)
        .catch(error => $dependencies.common.logger.error("Error refreshing user store", InfrastructureError.newFromUnknownError({}, error))),
    );

    return {};
  },
});
