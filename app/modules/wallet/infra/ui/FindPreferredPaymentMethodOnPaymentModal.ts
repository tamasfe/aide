import type { PaymentMethodRepositoryI } from "../../domain/PaymentMethodRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { PaymentLimits } from "../../domain/PaymentLimits";

interface PaymentMethodResponseI {
  id: number;
  identifier: "pix";
  limits: PaymentLimits;
}
export class FindPreferredPaymentMethodOnPaymentModal {
  constructor(
    private paymentMethodRepo: PaymentMethodRepositoryI,
    private logger: LoggerI,
  ) {}

  public PREFERRED_METHOD = "pix" as const;

  public FALLBACK_FOR_MINIMUM_AMOUNT = 2;
  public FALLBACK_FOR_MAX_AMOUNT = null;
  public FALLBACK_FOR_COOLDOWN_SECONDS = null;

  public async handle(currency: WalletCurrency): Promise<PaymentMethodResponseI | null> {
    const paymentMethodResult = await this.paymentMethodRepo.findOne(currency, this.PREFERRED_METHOD);
    if (paymentMethodResult.isFailure) {
      this.logger.error("! Error finding the payment method for the payment modal. This is critical as the user might not be able to deposit or withdraw any money!", paymentMethodResult.error);
      return null;
    }

    const limitsResult = await this.paymentMethodRepo.findLimits(currency, paymentMethodResult.value.id);
    if (limitsResult.isFailure) {
      this.logger.error("Error finding pix payment limits, returning fallback amounts", limitsResult.error, { paymentMethod: paymentMethodResult.value });
      return {
        id: paymentMethodResult.value.id,
        identifier: paymentMethodResult.value.identifier,
        limits: {
          depositMin: this.FALLBACK_FOR_MINIMUM_AMOUNT,
          depositMax: this.FALLBACK_FOR_MAX_AMOUNT,
          depositCooldown: this.FALLBACK_FOR_COOLDOWN_SECONDS,
          withdrawalMin: this.FALLBACK_FOR_MINIMUM_AMOUNT,
          withdrawalMax: this.FALLBACK_FOR_MAX_AMOUNT,
          withdrawalCooldown: this.FALLBACK_FOR_COOLDOWN_SECONDS,
          timeframeLimits: [],
        },

      };
    }

    return {
      id: paymentMethodResult.value.id,
      identifier: paymentMethodResult.value.identifier,
      limits: limitsResult.value,
    };
  }
}
