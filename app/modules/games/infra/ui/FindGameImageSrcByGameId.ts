export class FindGameImageSrcByGameId {
  constructor(private baseUrl: string) {}

  public async handle(gameId: number): Promise<string> {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network

    if (this.baseUrl === "") {
      return this.dumbImageSrcFromLocal(gameId);
    }

    return this.imageSrcFromGirobetBackend(gameId);
  }

  private imageSrcFromGirobetBackend(gameId: number): string {
    return `${this.baseUrl}/game/${gameId}/image`;
  }

  private dumbImageSrcFromLocal(gameId: number): string {
    return `/assets/images/games/${gameId}.png`;
  }
}
