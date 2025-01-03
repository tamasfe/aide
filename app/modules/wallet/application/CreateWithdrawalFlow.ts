import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class CreateWithdrawalFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(amount: number, currency: components["schemas"]["Currency"], paymentMethodId: number) {
    const result = await this.paymentsRepo.createWithdrawalFlow(amount, currency, paymentMethodId);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:payments:withdrawal-flow-created", {
      flowId: result.value.flowId,
    });

    return success();
  }
}
