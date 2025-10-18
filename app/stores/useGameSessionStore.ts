type GameSessionStoreI = {
  playing: boolean;
};

export default defineStore("game-session", {
  state: (): GameSessionStoreI => ({
    playing: false,
  }),
});
