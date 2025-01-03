import { type PaymentType, Payment } from "../domain/Payment";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export class PaymentRepositoryDumb implements PaymentRepositoryI {
  public async searchPaginating(_searchParams: { type: PaymentType | null; walletId: number | null }, limit: number, offset: number): Promise<Result<{ payments: Payment[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    return success({
      payments: [
        Payment.new({
          amount: 100,
          currency: "EUR",
          createdAt: new Date(),
          id: 1,
          type: "deposit",
          walletId: 1,
          status: "approved",
        }),
      ],
      pagination: {
        limit,
        offset,
        totalItems: 0,
      },
    });
  }

  public async createDepositFlow(_amount: number, _currency: components["schemas"]["Currency"], _paymentMethodId: number) {
    return success({
      flowId: 123,
      pix: {
        code: "code_returned",
      },
    });
  }

  public async createWithdrawalFlow(_amount: number, _currency: components["schemas"]["Currency"], _paymentMethodId: number) {
    return success({
      flowId: 123,
    });
  }

  public async findPaymentLimits(_currency: components["schemas"]["Currency"], _paymentMethodId: number): Promise<Result<{ deposit: { min: number; max: number }; withdrawal: { min: number; max: number } }, InfrastructureError>> {
    return success({
      deposit: {
        min: 5,
        max: 500,
      },
      withdrawal: {
        min: 5,
        max: 500,
      },
    });
  }
}
