export default defineNuxtPlugin({
  name: "module-wallets-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const walletStore = useWalletStore();

    /**
     *
     * Event listeners
     *
     */
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:users:user-logged-in",
      () => walletStore.refresh(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:users:user-logged-out",
      () => walletStore.refresh(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:users:user-closed-account",
      () => walletStore.refresh(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:signup-flows:signup-flow-submitted",
      () => walletStore.refresh(),
    );

    const currentSessionGameId = useState<null | string>("current-session-game-identifier", () => null);
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:games:game-session-started",
      ({ gameIdentifier }) => {
        walletStore.hideBalance();
        currentSessionGameId.value = gameIdentifier;
      },
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:games:game-session-finished",
      async ({ gameIdentifier }) => {
        if (gameIdentifier === currentSessionGameId.value) {
          await walletStore.refresh();
        }
      },
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:payments:payment-status-updated",
      () => walletStore.refresh(),
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet-backend:events:wallets:wallet-balance-updated",
      ({ balanceBonus, currency, balanceLocked, balanceUnlocked }) => walletStore.updateBalance({
        bonus: balanceBonus,
        locked: balanceLocked,
        unlocked: balanceUnlocked,
      }, currency),
    );

    /**
     *
     * Init user pinia store
     *
     */
    await callOnce("wallet-store-initiation", async () => walletStore.refresh());

    return {};
  },
});
