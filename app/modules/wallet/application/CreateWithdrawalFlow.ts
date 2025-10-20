import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import { success } from "~/packages/result";
import type { NuxtApp } from "#app";

export class CreateWithdrawalFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly nuxtApp: NuxtApp,
  ) {}

  public async handle(
    amount: number,
    currency: WalletCurrency,
    paymentMethodId: number,
  ) {
    const result = await this.paymentsRepo.createWithdrawalFlow(
      amount,
      currency,
      paymentMethodId,
    );
    if (result.isFailure) {
      return result;
    }

    await this.nuxtApp.callHook(
      "frontend:event:payment:withdrawal:created",
      {
        flowId: result.value.flowId,
        amount,
        currency,
        totalWithdrawals: result.value.metadata.paymentCounts.total,
      },
    );

    return success();
  }
}
