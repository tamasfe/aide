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
    useEventBusSubscription("frontend:events:users:user-logged-in", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
      await $dependencies.clicks.ui.setUsersPreviousActivity(new Date().toISOString());
    });

    useEventBusSubscription("frontend:events:users:user-logged-out", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    useEventBusSubscription("frontend:events:users:user-closed-account", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    useEventBusSubscription("frontend:events:users:user-settings-updated", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    useEventBusSubscription("frontend:events:users:password-recovered", () => {
      $dependencies.users.ui.emitCommandOpenUserActionModal.handle("login");
    });

    useEventBusSubscription("frontend:events:signup-flows:signup-flow-submitted", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    useEventBusSubscription("frontend:events:payments:deposit-flow-created", ({ flowId, code, amount, currency, paymentMethodId }) => {
      $dependencies.users.ui.emitCommandOpenUserActionModal.handle({
        modal: "deposit_confirm",
        data: { flowId, paymentCode: code, amount, currency, paymentMethodId },
      });
    });

    /**
     *
     * Init user pinia store
     *
     */
    await callOnce("user-store-init", async () => {
      await userStore.refreshUser()
        .catch(error => $dependencies.common.logger.error("Error refreshing user store", InfrastructureError.newFromUnknownError({}, error)));

      if (userStore.isAuthenticated && import.meta.server) {
        await $dependencies.clicks.ui.setUsersPreviousActivity(new Date().toISOString());
      }
    },
    );

    return {};
  },
});
