import type { ErrorPaymentMethodNotFound } from "../domain/ErrorPaymentMethodNotFound";
import type { PaymentMethodI, PaymentMethodIdentifier } from "../domain/PaymentMethod";
import type { PaymentMethodRepositoryI } from "../domain/PaymentMethodRepository";
import type { WalletCurrency } from "../domain/WalletCurrency";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class PaymentMethodRepositoryDumb implements PaymentMethodRepositoryI {
  public async search(_currency: WalletCurrency): Promise<Result<PaymentMethodI[], InfrastructureError>> {
    return success([
      { id: 1, identifier: "pix" },
    ]);
  }

  public async findOne(_currency: WalletCurrency, _identifier: PaymentMethodIdentifier): Promise<Result<PaymentMethodI, ErrorPaymentMethodNotFound | InfrastructureError>> {
    return success(
      { id: 1, identifier: "pix" },
    );
  }

  public async findLimits(_currency: WalletCurrency, _paymentMethodId: number): Promise<Result<{ deposit: { min: number; max: number }; withdrawal: { min: number; max: number } }, InfrastructureError>> {
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
