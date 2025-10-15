export default defineNuxtPlugin({
  name: "module-game-sessions-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const gameSessionStore = useGameSessionStore();

    useEventBusSubscription("frontend:events:games:game-session-started", async ({ gameIdentifier }) => {
      gameSessionStore.startGameSession(gameIdentifier);
    });

    useEventBusSubscription("frontend:events:games:game-session-finished", async ({ gameIdentifier }) => {
      gameSessionStore.endGameSession(gameIdentifier);
    });

    return {};
  },
});
