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
      "girobet:events:users:user-logged-in",
      () => walletStore.refresh(),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-out",
      () => walletStore.refresh(),
    );

    const currentSessionGameId = useState<null | number>("current-session-game-id", () => null);
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:games:game-session-started",
      ({ gameId }) => {
        walletStore.hideBalance();
        currentSessionGameId.value = gameId;
      },
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:games:game-session-finished",
      ({ gameId }) => {
        if (gameId === currentSessionGameId.value) {
          walletStore.refresh();
        }
      },
    );

    /**
     *
     * Init user pinia store
     *
     */
    await useAsyncData("wallet-store-initiation", () => walletStore.refresh().then(() => true));

    return {};
  },
});
