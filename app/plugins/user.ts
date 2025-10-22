import { InfrastructureError } from "~/packages/result/infrastructure-error";

export default defineNuxtPlugin({
  name: "user",
  dependsOn: ["api-client"],
  parallel: true,
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const userSettingsStore = useUserSettingsStore();
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
      nuxtApp.callHook("frontend:command:modal:login:open");
    });

    nuxtApp.hook("frontend:event:signup-flow:submitted", async () => {
      await userStore.refreshUser();
      await userSettingsStore.refresh();
    });

    nuxtApp.hook("frontend:event:payment:deposit:created", ({ flowId, code, amount, currency, paymentMethodId }) => {
      nuxtApp.callHook("frontend:command:modal:deposit-confirm:open", {
        flowId,
        paymentCode: code,
        amount,
        currency,
        paymentMethodId,
      });
    });

    return {};
  },
});
