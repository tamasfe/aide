import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

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

    await this.asyncMessagePublisher.emit("frontend:events:payments:deposit-flow-created", {
      paymentMethodId,
      flowId: Number(result.value.flowId),
      code: result.value.pix.code,
      amount,
      currency,
      totalDeposits: result.value.metadata.paymentCounts.total,
    });

    return success();
  }
}
