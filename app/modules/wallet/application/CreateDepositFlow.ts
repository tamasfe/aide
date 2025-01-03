import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export class CreateDepositFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(amount: number, currency: components["schemas"]["Currency"], paymentMethodId: number) {
    const result = await this.paymentsRepo.createDepositFlow(amount, currency, paymentMethodId);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:payments:deposit-flow-created", {
      paymentMethodId,
      flowId: Number(result.value.flowId),
      code: result.value.pix.code,
      amount,
      currency,
    });

    return success();
  }
}
