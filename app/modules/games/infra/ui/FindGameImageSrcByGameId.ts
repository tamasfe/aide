export class FindGameImageSrcByGameId {
  public async handle(gameId: number): Promise<string> {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network
    return `/assets/images/games/${gameId}.png`;
  }
}
