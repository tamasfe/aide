type GameSessionStoreI = {
  gameIdentifiersBeingPlayed: Set<string>;
};

export const useGameSessionStore = defineStore("gameSessionStore", {
  state: (): GameSessionStoreI => ({
    gameIdentifiersBeingPlayed: new Set<string>(),
  }),

  getters: {
    isPlaying: (state) => {
      return state.gameIdentifiersBeingPlayed.size > 0;
    },
  },

  actions: {
    startGameSession(gameIdentifier: string) {
      this.gameIdentifiersBeingPlayed.add(gameIdentifier);
      return;
    },

    endGameSession(gameIdentifier: string) {
      this.gameIdentifiersBeingPlayed.delete(gameIdentifier);
      return;
    },
  },
});
