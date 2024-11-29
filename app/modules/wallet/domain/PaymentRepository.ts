import type { ErrorPendingPaymentFlow } from "./ErrorPendingPaymentFlow";
import type { Payment, PaymentType } from "./Payment";
import type { WalletCurrency } from "./WalletCurrency";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface PaymentRepositoryI {
  searchPaginating(searchParams: { type: PaymentType | null; walletId: number | null }, limit: number, offset: number): Promise<Result<{
    payments: Payment[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  createDepositFlow(amount: number, currency: WalletCurrency, paymentMethodId: number): Promise<Result<{ pix: { flowId: string; url: string } }, ErrorPendingPaymentFlow | InfrastructureError>>;
}
