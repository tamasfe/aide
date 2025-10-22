import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success } from "~/packages/result";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { NuxtApp } from "#app";

export class CreateDepositFlow {
  constructor(
    private readonly paymentsRepo: PaymentRepositoryI,
    private readonly nuxtApp: NuxtApp,
  ) {}

  public async handle(
    amount: number,
    currency: WalletCurrency,
    paymentMethodId: number,
  ) {
    const result = await this.paymentsRepo.createDepositFlow(
      amount,
      currency,
      paymentMethodId,
    );
    if (result.isFailure) {
      return result;
    }

    await this.nuxtApp.callHook(
      "frontend:command:modal:deposit:close",
    );

    await this.nuxtApp.callHook(
      "frontend:event:payment:deposit:created",
      {
        paymentMethodId,
        flowId: Number(result.value.flowId),
        code: result.value.pix.code,
        amount,
        currency,
        totalDeposits: result.value.metadata.paymentCounts.total,
      },
    );

    return success();
  }
}
