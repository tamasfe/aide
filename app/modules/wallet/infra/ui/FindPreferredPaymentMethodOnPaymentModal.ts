import type { PaymentMethodRepositoryI } from "../../domain/PaymentMethodRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { PaymentLimits } from "../../domain/PaymentLimits";
import { ErrorPaymentMethodNotFound } from "../../domain/ErrorPaymentMethodNotFound";
import {
  addLogoToPaymentMethod,
  type PaymentMethodWithLogo,
} from "../../domain/PaymentMethod";

interface PaymentMethodResponseI {
  currency: WalletCurrency;
  preferred: PaymentMethodWithLogo;
  methods: PaymentMethodWithLogo[];
  limits: PaymentLimits;
}

export class FindPreferredPaymentMethodOnStoreRefresh {
  constructor(
    private paymentMethodRepo: PaymentMethodRepositoryI,
    private logger: LoggerI,
  ) {}

  public PREFERRED_METHOD = "pix" as const;

  public FALLBACK_FOR_MINIMUM_AMOUNT = 2;
  public FALLBACK_FOR_MAX_AMOUNT = null;
  public FALLBACK_FOR_COOLDOWN_SECONDS = null;

  public async handle(): Promise<PaymentMethodResponseI | null> {
    const walletStore = useWalletStore();

    const currency = walletStore.activeCurrency;

    if (!currency) {
      this.logger.warn(
        "No wallet currency found when trying to find preferred payment method on payment modal",
      );
      return null;
    }

    const paymentMethodsResult = await this.paymentMethodRepo.search(currency);
    if (paymentMethodsResult.isFailure) {
      if (paymentMethodsResult.error.name === "ErrorUnauthorized") {
        return null;
      }
      this.logger.error(
        "! Error finding the payment methods for the payment modal. This is critical as the user might not be able to deposit or withdraw any money!",
        paymentMethodsResult.error,
        { currency },
      );
      return null;
    }

    const methods = paymentMethodsResult.value.map(method =>
      addLogoToPaymentMethod(method),
    );

    const preferred = methods.find(
      method => method.identifier === this.PREFERRED_METHOD,
    );
    if (!preferred) {
      this.logger.error(
        "! Error finding the preferred payment method for the payment modal. This is critical as the user might not be able to deposit or withdraw any money!",
        ErrorPaymentMethodNotFound.new({
          currency,
          identifier: this.PREFERRED_METHOD,
        }),
        { currency, methods, preferredMethod: this.PREFERRED_METHOD },
      );
      return null;
    }

    const limitsResult = await this.paymentMethodRepo.findLimits(
      currency,
      preferred.id,
    );

    if (limitsResult.isFailure) {
      this.logger.error(
        "Error finding pix payment limits, returning fallback amounts",
        limitsResult.error,
        { preferred, methods, currency },
      );
      return {
        currency,
        preferred,
        methods,
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
      currency,
      preferred,
      methods,
      limits: limitsResult.value,
    };
  }
}
