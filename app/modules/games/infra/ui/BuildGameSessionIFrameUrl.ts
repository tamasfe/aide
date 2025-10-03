export class BuildGameSessionIFrameUrl {
  constructor(private apiBaseUrl: string) {}

  public handle(gameIdentifier: string, device: "mobile" | "desktop", currency: string) {
    if (this.apiBaseUrl === "") {
      return `http://localhost:3050/game/${gameIdentifier}/session?client_type=${device}&currency=${currency}`;
    }

    return `${this.apiBaseUrl}/game/${gameIdentifier}/session?client_type=${device}&currency=${currency}`;
  }
}
