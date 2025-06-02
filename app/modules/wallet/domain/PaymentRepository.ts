import type { ErrorInsufficientFunds } from "./ErrorInsufficientFunds";
import type { ErrorWalletHasInsufficientWagers } from "./ErrorWalletHasInsufficientWagers";
import type { ErrorPaymentAmountOutsideLimits } from "./ErrorPaymentAmountOutsideLimits";
import type { ErrorPaymentMethodNotAllowed } from "./ErrorPaymentMethodNotAllowed";
import type { ErrorPendingPaymentFlow } from "./ErrorPendingPaymentFlow";
import type { Payment, PaymentType } from "./Payment";
import type { ErrorWalletPaymentCooldownNotFinished } from "./ErrorWalletPaymentCooldownNotFinished";
import type { ErrorPaymentAmountExceedsTimeframeLimits } from "./ErrorPaymentAmountExceedsTimeframeLimits";
import type { ErrorPendingIdentityCheck } from "./ErrorPendingIdentityCheck";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export interface PaymentRepositoryI {
  searchPaginating(searchParams: { type: PaymentType | null; walletId: number | null }, limit: number, offset: number): Promise<Result<{
    payments: Payment[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  createDepositFlow(amount: number, currency: WalletCurrency, paymentMethodId: number): Promise<
    Result<
      { flowId: number; pix: { code: string }; metadata: { paymentCounts: { total: number } } },
      ErrorPendingPaymentFlow | ErrorPaymentMethodNotAllowed | ErrorPaymentAmountOutsideLimits | ErrorPaymentAmountExceedsTimeframeLimits | InfrastructureError
    >>;
  createWithdrawalFlow(amount: number, currency: WalletCurrency, paymentMethodId: number): Promise<
    Result<
      { flowId: number; metadata: { paymentCounts: { total: number } } },
      ErrorPendingPaymentFlow | ErrorWalletHasInsufficientWagers | ErrorInsufficientFunds | ErrorPaymentAmountExceedsTimeframeLimits | ErrorWalletPaymentCooldownNotFinished | ErrorPaymentMethodNotAllowed | ErrorPaymentAmountOutsideLimits | ErrorPendingIdentityCheck | InfrastructureError
    >>;
}
