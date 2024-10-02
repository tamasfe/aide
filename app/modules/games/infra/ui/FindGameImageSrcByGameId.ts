export class FindGameImageSrcByGameId {
  constructor(private baseUrl: string) {}

  public async handle(gameId: number): Promise<string> {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network
    return `${this.baseUrl}/assets/images/games/${gameId}.png`;
  }
}
