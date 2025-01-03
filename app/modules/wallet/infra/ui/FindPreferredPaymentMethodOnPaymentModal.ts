import type { PaymentMethodRepositoryI } from "../../domain/PaymentMethodRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

interface PaymentMethodResponseI {
  id: number;
  identifier: "pix";
  depositAmounts: {
    min: number | null;
    max: number | null;
    cooldownSeconds: number | null;
  };
  withdrawalAmounts: {
    min: number | null;
    max: number | null;
    cooldownSeconds: number | null;
  };
}
export class FindPreferredPaymentMethodOnPaymentModal {
  constructor(
    private paymentMethodRepo: PaymentMethodRepositoryI,
    private logger: LoggerI,
  ) {}

  public PREFERRED_METHOD = "pix" as const;

  public FALLBACK_FOR_MINIMUM_AMOUNT = 0;
  public FALLBACK_FOR_MAX_AMOUNT = null;
  public FALLBACK_FOR_COOLDOWN_SECONDS = null;

  public async handle(currency: components["schemas"]["Currency"]): Promise<PaymentMethodResponseI | null> {
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
        depositAmounts: {
          min: this.FALLBACK_FOR_MINIMUM_AMOUNT,
          max: this.FALLBACK_FOR_MAX_AMOUNT,
          cooldownSeconds: this.FALLBACK_FOR_COOLDOWN_SECONDS,
        },
        withdrawalAmounts: {
          min: this.FALLBACK_FOR_MINIMUM_AMOUNT,
          max: this.FALLBACK_FOR_MAX_AMOUNT,
          cooldownSeconds: this.FALLBACK_FOR_COOLDOWN_SECONDS,
        },
      };
    }

    return {
      id: paymentMethodResult.value.id,
      identifier: paymentMethodResult.value.identifier,
      depositAmounts: {
        min: limitsResult.value.deposit.min ?? this.FALLBACK_FOR_MINIMUM_AMOUNT,
        max: limitsResult.value.deposit.max ?? this.FALLBACK_FOR_MAX_AMOUNT,
        cooldownSeconds: limitsResult.value.deposit.cooldownSeconds ?? this.FALLBACK_FOR_COOLDOWN_SECONDS,
      },
      withdrawalAmounts: {
        min: limitsResult.value.withdrawal.min ?? this.FALLBACK_FOR_MINIMUM_AMOUNT,
        max: limitsResult.value.withdrawal.max ?? this.FALLBACK_FOR_MAX_AMOUNT,
        cooldownSeconds: limitsResult.value.withdrawal.cooldownSeconds ?? this.FALLBACK_FOR_COOLDOWN_SECONDS,
      },
    };
  }
}
