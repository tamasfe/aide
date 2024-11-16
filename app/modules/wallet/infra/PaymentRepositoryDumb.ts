import { type PaymentType, Payment } from "../domain/Payment";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

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
          identifier: "identifier",
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
}
