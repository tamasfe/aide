export default function (gameIdentifier: string, clientType: "desktop" | "mobile") {
  const { $dependencies } = useNuxtApp();
  const walletStore = useWalletStore();
  const userStore = useUserStore();

  // We have to disable server-side rendering for the game, as we rely on our cloudflare proxy to route these requests
  // to our main-instance in ireland. If we enable SSR, the request will be made to the API instance within the same region, which means
  // in the case of a secondary region, the request will be sent against the API in that region, which then has to send mutating
  // queries to the main DB in the primary region leading to major slowdowns due to high SQL query RTT (round trip time).
  // If we want to allow SSR session inititalization, we have to first find a solution for redirecting these requests to the main region internally.
  const { data } = useAsyncData(async () => {
    return await $dependencies.games.ui.createGameSessionFromGamePage.handle(
      gameIdentifier,
      userStore.user?.id,
      walletStore.wallet?.currency,
      clientType,
    );
  },
  {
    watch: [() => userStore.isAuthenticated, () => walletStore.wallet?.currency],
    server: false,
  });

  return data;
}
