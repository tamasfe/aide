import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { success } from "~/packages/result";

export class SearchPaymentsPaginating {
  constructor(private repo: PaymentRepositoryI) {}

  public async handle(walletId: number | null, type: "deposit" | "withdrawal" | null, page: number, pageSize: number) {
    const result = await this.repo.searchPaginating({ type, walletId }, pageSize, page * pageSize);
    if (result.isFailure) {
      return result;
    }

    return success({
      payments: result.value.payments.map(payment => payment.toJSON()),
      pagination: result.value.pagination,
    });
  }
}
