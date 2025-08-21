import type { PaymentMethodRepositoryI } from "../../domain/PaymentMethodRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

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
      if (limitsResult.error.name === "ErrorWalletNotFound") {
        this.logger.warn("ErrorWalletNotFound finding payment method limits, returning fallback amounts. In the future we want to handle this case better, as the fallbacks might not be the same for all payment methods, currencies, and users. Probably the backend will have to return the fallback amounts instead of an error.", {err: limitsResult.error});
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
