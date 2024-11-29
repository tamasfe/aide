import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "../domain/WalletCurrency";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

type PaymentMethod = "pix";
const PaymentMethodToId: Record<PaymentMethod, number> = {
  pix: 1,
};

export class CreateDepositFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(amount: number, currency: WalletCurrency, paymentMethod: PaymentMethod) {
    const paymentMethodId = PaymentMethodToId[paymentMethod];

    const result = await this.paymentsRepo.createDepositFlow(amount, currency, paymentMethodId);
    if (result.isFailure) {
      return result;
    }

    await this.asyncMessagePublisher.emit("girobet:events:payments:deposit-flow-created", {
      paymentMethod,
      flowId: result.value.pix.flowId,
      code: result.value.pix.url,
    });

    return success();
  }
}
