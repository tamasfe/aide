export class FindProviderImageSrcById {
  constructor(private baseUrl: string) {}

  public async handle(providerId: number): Promise<string> {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network

    if (this.baseUrl === "") {
      return this.dumbImageSrcFromLocal(providerId);
    }

    return this.imageSrcFromGirobetBackend(providerId);
  }

  private imageSrcFromGirobetBackend(providerId: number): string {
    return `${this.baseUrl}/game-provider/${providerId}/image?variant=small&color=white`;
  }

  private dumbImageSrcFromLocal(providerId: number): string {
    return `/assets/girobet/images/providers/${providerId}.png`;
  }
}
