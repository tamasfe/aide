import type { ErrorInsufficientFunds } from "./ErrorInsufficientFunds";
import type { ErrorWalletHasInsufficientWagers } from "./ErrorWalletHasInsufficientWagers";
import type { ErrorPaymentAmountOutsideLimits } from "./ErrorPaymentAmountOutsideLimits";
import type { ErrorPaymentMethodNotAllowed } from "./ErrorPaymentMethodNotAllowed";
import type { ErrorPendingPaymentFlow } from "./ErrorPendingPaymentFlow";
import type { Payment, PaymentType } from "./Payment";
import type { ErrorWalletPaymentCooldownNotFinished } from "./ErrorWalletPaymentCooldownNotFinished";
import type { ErrorPaymentAmountExceedsTimeframeLimits } from "./ErrorPaymentAmountExceedsTimeframeLimits";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export interface PaymentRepositoryI {
  searchPaginating(searchParams: { type: PaymentType | null; walletId: number | null }, limit: number, offset: number): Promise<Result<{
    payments: Payment[];
    pagination: {
      limit: number;
      offset: number;
      totalItems: number;
    };
  }, InfrastructureError>>;

  createDepositFlow(amount: number, currency: components["schemas"]["Currency"], paymentMethodId: number): Promise<
    Result<
      { flowId: number; pix: { code: string } },
      ErrorPendingPaymentFlow | ErrorPaymentMethodNotAllowed | ErrorPaymentAmountOutsideLimits | ErrorPaymentAmountExceedsTimeframeLimits | InfrastructureError
    >>;
  createWithdrawalFlow(amount: number, currency: components["schemas"]["Currency"], paymentMethodId: number): Promise<
    Result<
      { flowId: number },
      ErrorPendingPaymentFlow | ErrorWalletHasInsufficientWagers | ErrorInsufficientFunds | ErrorPaymentAmountExceedsTimeframeLimits | ErrorWalletPaymentCooldownNotFinished | ErrorPaymentMethodNotAllowed | ErrorPaymentAmountOutsideLimits | InfrastructureError
    >>;
}
