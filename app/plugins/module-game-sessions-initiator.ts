export default defineNuxtPlugin({
  name: "module-game-sessions-initiator",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup(_nuxtApp) {
    const { $dependencies } = useNuxtApp();
    const gameSessionStore = useGameSessionStore();

    /**
     *
     * Event listeners
     *
     */
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:games:game-session-started",
      ({ gameIdentifier }) => {
        gameSessionStore.startGameSession(gameIdentifier);
      },
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "frontend:events:games:game-session-finished",
      async ({ gameIdentifier }) => {
        gameSessionStore.endGameSession(gameIdentifier);
      },
    );

    return {};
  },
});
