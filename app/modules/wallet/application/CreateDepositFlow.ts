import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "../domain/WalletCurrency";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class CreateDepositFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(amount: number, currency: WalletCurrency, paymentMethodId: number) {
    const result = await this.paymentsRepo.createDepositFlow(amount, currency, paymentMethodId);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:payments:deposit-flow-created", {
      paymentMethodId,
      flowId: result.value.pix.flowId,
      code: result.value.pix.url,
    });

    return success();
  }
}
