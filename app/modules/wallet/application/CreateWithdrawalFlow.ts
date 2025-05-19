import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class CreateWithdrawalFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(amount: number, currency: WalletCurrency, paymentMethodId: number) {
    const result = await this.paymentsRepo.createWithdrawalFlow(amount, currency, paymentMethodId);
    if (result.isFailure) {
      return result;
    }

    const VARIABLE_TO_REMOVE_ONCE_BACKEND_RETURNS_RESPONSE = 1234567890;

    await this.asyncMessagePublisher.emit("girobet:events:payments:withdrawal-flow-created", {
      flowId: result.value.flowId,
      amount,
      currency,
      sucessfulWithdrawals: VARIABLE_TO_REMOVE_ONCE_BACKEND_RETURNS_RESPONSE,
    });

    return success();
  }
}
