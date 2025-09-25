import type { ErrorPaymentMethodNotFound } from "../domain/ErrorPaymentMethodNotFound";
import type { PaymentMethodI, PaymentMethodIdentifier } from "../domain/PaymentMethod";
import type { PaymentMethodRepositoryI } from "../domain/PaymentMethodRepository";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

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

  public async findLimits(_currency: WalletCurrency, _paymentMethodId: number) {
    return success({
      depositCooldown: 10,
      depositMax: 10,
      depositMin: 1,
      timeframeLimits: [],
      withdrawalCooldown: 10,
      withdrawalMax: 10,
      withdrawalMin: 1,
    });
  }
}
