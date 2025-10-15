import { DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET } from "~/modules/wallet/domain/Wallet";

export default defineNuxtPlugin({
  name: "module-wallets-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const walletStore = useWalletStore();
    const paymentMethodsStore = useWalletPaymentMethodsStore();

    const refreshStores = async () => {
      await walletStore.refresh();

      paymentMethodsStore.setLoading();
      const result = await $dependencies.wallets.ui.findPreferredPaymentMethodsOnStoreRefresh.handle(walletStore.wallet?.currency ?? DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET);
      paymentMethodsStore.refresh(result);
    };

    /**
     *
     * Event listeners
     *
     */
    // $dependencies.common.asyncMessagePublisher.subscribe(
    //   "frontend:events:users:user-logged-in",
    //   () => refreshStores(),
    // );

    useEventBusSubscription("frontend:events:users:user-logged-in", async () => refreshStores());

    useEventBusSubscription("backend:events:wallets:wallet-balance-updated",
      ({ balanceBonus, currency, balanceLocked, balanceUnlocked }) => {
        walletStore.updateBalance({
          bonus: balanceBonus,
          locked: balanceLocked,
          unlocked: balanceUnlocked,
        }, currency);
      });

    useEventBusSubscription("backend:events:payments:payment-status-updated", async () => {
      await walletStore.refresh();
    });

    useEventBusSubscription("frontend:events:users:user-logged-out", async () => {
      await walletStore.refresh();
      paymentMethodsStore.refresh(null);
    });

    useEventBusSubscription("frontend:events:users:user-closed-account", async () => {
      await walletStore.refresh();
      paymentMethodsStore.refresh(null);
    });

    useEventBusSubscription("frontend:events:signup-flows:signup-flow-submitted", async () => {
      await refreshStores();
    });

    /**
     *
     * Init user pinia store
     *
     */
    await callOnce("wallet-store-initiation", () => refreshStores());

    return {};
  },
});
