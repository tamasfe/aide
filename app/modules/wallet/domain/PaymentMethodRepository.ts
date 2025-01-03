import type { PaymentMethodI, PaymentMethodIdentifier } from "./PaymentMethod";
import type { ErrorPaymentMethodNotFound } from "./ErrorPaymentMethodNotFound";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export interface PaymentMethodRepositoryI {
  search(currency: WalletCurrency): Promise<Result<PaymentMethodI[], InfrastructureError>>;
  findOne(currency: WalletCurrency, identifier: PaymentMethodIdentifier): Promise<Result<PaymentMethodI, ErrorPaymentMethodNotFound | InfrastructureError>>;
  findLimits(currency: WalletCurrency, paymentMethodId: number): Promise<Result<{
    deposit: { min: number | null; max: number | null; cooldownSeconds: number | null }; withdrawal: { min: number | null; max: number | null; cooldownSeconds: number | null };
  }, InfrastructureError>>;
}
