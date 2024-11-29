import { success, type CustomError, type EmptyResult } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

type JurisdictionNotSupportedPayload =
  | { reason: "not_supported_no_alternative_site"; jurisdiction: string }
  | { reason: "not_supported_alternative_site"; jurisdiction: string; alternativeSite: string }
  | { reason: "user_account_mismatch"; jurisdiction: string }
  | { reason: "supported_but_not_enabled"; jurisdiction: string };

export class EmitOpenJurisdictionModalOnJurisdictionNotSupported {
  constructor(private asyncMessagePublisher: AsyncMessagePublisherI) {}

  public async handle(payload: JurisdictionNotSupportedPayload): Promise<EmptyResult<CustomError>> {
    switch (payload.reason) {
      case "not_supported_no_alternative_site":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-no-alternative", {
          jurisdiction: payload.jurisdiction,
        });
        return success();

      case "not_supported_alternative_site":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-alternative", {
          jurisdiction: payload.jurisdiction,
          allowedDomain: payload.alternativeSite,
        });
        return success();

      case "user_account_mismatch":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-no-alternative", {
          jurisdiction: payload.jurisdiction,
        });
        return success();

      case "supported_but_not_enabled":
        await this.asyncMessagePublisher.emit("girobet:commands:modals:open-restrict-expanding", {
          jurisdiction: payload.jurisdiction,
        });
        return success();
    }
  }
}
