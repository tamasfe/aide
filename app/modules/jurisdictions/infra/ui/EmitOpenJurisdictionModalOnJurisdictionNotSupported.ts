import { success, type CustomError, type EmptyResult } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

type JurisdictionNotSupportedPayload =
  | { reason: "alternative_site"; jurisdiction: string; alternativeSite: string }
  | { reason: "network_configuration"; jurisdiction: string }
  | { reason: "not_supported"; jurisdiction: string };

export class EmitOpenJurisdictionModalOnJurisdictionNotSupported {
  constructor(
    private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(payload: JurisdictionNotSupportedPayload): Promise<EmptyResult<CustomError>> {
    switch (payload.reason) {
      case "not_supported":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-expanding", {
          jurisdiction: payload.jurisdiction,
        });
        return success();

      case "alternative_site":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-alternative", {
          jurisdiction: payload.jurisdiction,
          allowedDomain: payload.alternativeSite,
        });
        return success();

      case "network_configuration":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-network-issues", {
          jurisdiction: payload.jurisdiction,
        });
        return success();
    }
  }
}
