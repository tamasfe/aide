import { destructureGameIdentifier } from "../../domain/Game";

export class BuildGameSessionIFrameUrl {
  constructor(private apiBaseUrl: string) {}

  public handle(gameIdentifier: string, device: "mobile" | "desktop", currency: string) {
    const { gameSlug, providerSlug } = destructureGameIdentifier(gameIdentifier);

    if (this.apiBaseUrl === "") {
      return `http://localhost:3050/game/${providerSlug}/${gameSlug}/session?client_type=${device}&currency=${currency}`;
    }

    return `${this.apiBaseUrl}/game/${providerSlug}/${gameSlug}/session?client_type=${device}&currency=${currency}`;
  }
}
