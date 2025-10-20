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
    nuxtApp.hook("frontend:event:user:logged-in", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:user:logged-out", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:user:account-closed", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:user:settings-updated", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:user:password-recovered", async () => {
      userModule.ui.emitCommandOpenUserActionModal.handle("login");
    });

    nuxtApp.hook("frontend:event:signup-flow:submitted", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:payment:deposit:created", ({ flowId, code, amount, currency, paymentMethodId }) => {
      userModule.ui.emitCommandOpenUserActionModal.handle({
        modal: "deposit_confirm",
        data: { flowId, paymentCode: code, amount, currency, paymentMethodId },
      });
    });

    return {};
  },
});
