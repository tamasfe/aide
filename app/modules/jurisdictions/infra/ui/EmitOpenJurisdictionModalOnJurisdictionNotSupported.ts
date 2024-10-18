import type { ErrorJurisdictionIsNotSupported } from "../../domain/ErrorJurisdictionIsNotSupported";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class EmitOpenJurisdictionModalOnJurisdictionNotSupported {
  constructor(private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(error: ErrorJurisdictionIsNotSupported): Promise<void> {
    if (error.recommendedAlternativeSite) {
      await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-alternative", {
        jurisdiction: error.jurisdiction,
        allowedDomain: error.recommendedAlternativeSite,
      });
      return;
    }
    if (error.userJurisdictionDoesNotMatchNetwork) {
      await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-network-issues", {
        jurisdiction: error.jurisdiction,
      });
      return;
    }
    await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-expanding", {
      jurisdiction: error.jurisdiction,
    });
    return;
  }
}
