export class BuildGameSessionIFrameUrl {
  constructor(private apiBaseUrl: string) {}

  public handle(gameId: number, device: "mobile" | "desktop", currency: string) {
    if (this.apiBaseUrl === "") {
      return `http://localhost:3050/game/${gameId}/session?client_type=${device}&currency=${currency}`;
    }

    return `${this.apiBaseUrl}/game/${gameId}/session?client_type=${device}&currency=${currency}`;
  }
}
