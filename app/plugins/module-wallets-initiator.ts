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
      ({ gameIdentifier }) => {
        if (gameIdentifier === currentSessionGameId.value) {
          walletStore.refresh();
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
    const ENABLE_SERVER_SIDE_RENDERING = false;
    const DEFER_CLIENT_SIDE_LOADING = true;
    await useAsyncData("wallet-store-initiation", () => walletStore.refresh().then(() => true),
      { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
    );

    return {};
  },
});
