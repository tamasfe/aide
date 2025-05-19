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

    const VARIABLE_TO_REMOVE_ONCE_BACKEND_RETURNS_RESPONSE = 1234567890;

    await this.asyncMessagePublisher.emit("girobet:events:payments:deposit-flow-created", {
      paymentMethodId,
      flowId: Number(result.value.flowId),
      code: result.value.pix.code,
      amount,
      currency,
      sucessfulDeposits: VARIABLE_TO_REMOVE_ONCE_BACKEND_RETURNS_RESPONSE,
    });

    return success();
  }
}
