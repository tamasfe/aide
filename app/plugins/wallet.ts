import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";

export default defineNuxtPlugin({
  name: "wallet",
  parallel: true,
  dependsOn: ["user"],
  async setup(nuxtApp) {
    const walletStore = useWalletStore();
    const paymentMethodsStore = useWalletPaymentMethodsStore();
    const walletModule = useWalletModule();

    const refreshStores = async () => {
      await walletStore.refresh();
      paymentMethodsStore.setLoading();
      const result = await walletModule.ui.findPreferredPaymentMethodsOnStoreRefresh.handle(walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
      paymentMethodsStore.refresh(result);
    };

    if (import.meta.server) {
      await refreshStores();
    }

    if (import.meta.client) {
      nuxtApp.hook("frontend:events:users:user-logged-in", async () => refreshStores());

      nuxtApp.hook("backend:events:wallets:wallet-balance-updated",
        ({ balanceBonus, currency, balanceLocked, balanceUnlocked }) => {
          walletStore.updateBalance({
            bonus: balanceBonus,
            locked: balanceLocked,
            unlocked: balanceUnlocked,
          }, currency);
        });

      nuxtApp.hook("backend:events:payments:payment-status-updated", async () => {
        await walletStore.refresh();
      });

      nuxtApp.hook("frontend:events:users:user-logged-out", async () => {
        await walletStore.refresh();
        paymentMethodsStore.refresh(null);
      });

      nuxtApp.hook("frontend:events:users:user-closed-account", async () => {
        await walletStore.refresh();
        paymentMethodsStore.refresh(null);
      });

      nuxtApp.hook("frontend:events:signup-flows:signup-flow-submitted", async () => {
        await refreshStores();
      });
    }

    return {};
  },
});
