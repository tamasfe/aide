export default defineNuxtPlugin({
  name: "wallet",
  parallel: true,
  dependsOn: ["user"],
  async setup(nuxtApp) {
    const walletStore = useWalletStore();

    if (import.meta.server) {
      await walletStore.refresh();
    }

    if (import.meta.client) {
      nuxtApp.hook("frontend:event:user:logged-in", async () => walletStore.refresh());
      nuxtApp.hook("frontend:event:user:logged-out", async () => walletStore.refresh());

      nuxtApp.hook("backend:event:wallet:balance-updated",
        ({ balanceBonus, currency, balanceLocked, balanceUnlocked }) => {
          walletStore.updateBalance({
            bonus: balanceBonus,
            locked: balanceLocked,
            unlocked: balanceUnlocked,
          }, currency);
        });

      nuxtApp.hook("backend:event:payment:status-updated",
        async () => walletStore.refresh(),
      );

      nuxtApp.hook("frontend:event:signup-flow:submitted",
        async () => walletStore.refresh(),
      );
    }

    return {};
  },
});
