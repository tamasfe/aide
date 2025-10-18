import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "user",
  dependsOn: ["api-client"],
  parallel: true,
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const userSettingsStore = useUserSettingsStore();
    const userModule = useUserModule();
    const logger = useLogger();

    await userStore.refreshUser()
      .catch(error => logger.error("Error refreshing user store", InfrastructureError.newFromUnknownError({}, error)));

    /**
     *
     * Event listeners
     *
     */
    nuxtApp.hook("frontend:events:users:user-logged-in", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:events:users:user-logged-out", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:events:users:user-closed-account", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:events:users:user-settings-updated", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:events:users:password-recovered", async () => {
      userModule.ui.emitCommandOpenUserActionModal.handle("login");
    });

    nuxtApp.hook("frontend:events:signup-flows:signup-flow-submitted", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:events:payments:deposit-flow-created", ({ flowId, code, amount, currency, paymentMethodId }) => {
      userModule.ui.emitCommandOpenUserActionModal.handle({
        modal: "deposit_confirm",
        data: { flowId, paymentCode: code, amount, currency, paymentMethodId },
      });
    });

    return {};
  },
});
