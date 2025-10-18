import type { CreateWithdrawalFlow } from "../../application/CreateWithdrawalFlow";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type {
  DateTimeFormatterFunctionType,
  NumberFormatterFunctionType,
  TranslateFunctionType,
} from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import { humanizeDuration } from "~/packages/translation/domain/humanize-duration";
import type { NuxtApp } from "#app";

type ErrorResponse = {
  message: string;
  cta?: {
    label: string;
    action: () => void;
  };
};

export class CreateWithdrawalFlowOnForm {
  constructor(
    private readonly createWithdrawalFlow: CreateWithdrawalFlow,
    private readonly nuxtApp: NuxtApp,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
    private readonly d: DateTimeFormatterFunctionType,
    private readonly n: NumberFormatterFunctionType,
  ) {}

  public async handle(
    amount: number,
    currency: WalletCurrency,
    paymentMethodId: number,
  ): Promise<ErrorResponse> {
    const result = await this.createWithdrawalFlow.handle(
      amount,
      currency,
      paymentMethodId,
    );
    if (result.isFailure) {
      if (result.error.name === "ErrorPendingPaymentFlow") {
        if (result.error.pendingPaymentType === "withdrawal") {
          return {
            message: this.t(
              "modal_payments.error_creating_flow_pending_withdrawal",
            ),
          };
        }
      }

      if (result.error.name === "ErrorUserSandboxed") {
        return {
          message: this.t("modal_payments.error_creating_flow_user_sandboxed"),
        };
      }

      if (result.error.name === "ErrorPendingIdentityCheck") {
        return {
          message: this.t("modal_payments.error_creating_flow_pending_kyc"),
          cta: {
            label: this.t(
              "modal_payments.error_creating_flow_pending_kyc_cta_label",
            ),
            action: () => {
              this.nuxtApp.callHook(
                "frontend:commands:modals:close-user-interaction-modal",
              );
              window.location.href = "/settings/verification";
            },
          },
        };
      }

      if (result.error.name === "ErrorInsufficientFunds") {
        return {
          message: this.t(
            "modal_payments.error_creating_withdrawal_insufficient_funds",
          ),
        };
      }

      if (result.error.name === "ErrorPaymentAmountExceedsTimeframeLimits") {
        return {
          message: this.t(
            "modal_payments.error_creating_withdrawal_flow_amount_exceeds_timeframe_limits",
            {
              limit: `${result.error.limitAmount} ${currency}/${humanizeDuration(result.error.seconds, this.t)}`,
            },
          ),
        };
      }
      if (result.error.name === "ErrorPaymentCountExceedsTimeframeLimits") {
        return {
          message: this.t(
            "modal_payments.error_creating_withdrawal_flow_count_exceeds_timeframe_limits",
            {
              limit: `${result.error.limitCount}/${humanizeDuration(result.error.seconds, this.t)}`,
            },
          ),
        };
      }
      if (result.error.name === "ErrorPaymentAmountOutsideLimits") {
        if (result.error.limitExceeded === "min") {
          return {
            message: this.t(
              "modal_payments.error_creating_withdrawal_flow_amount_below_minimum",
              {
                min: this.n(result.error.amountLimit, {
                  currency,
                  style: "currency",
                }),
              },
            ),
          };
        }
        if (result.error.limitExceeded === "max") {
          return {
            message: this.t(
              "modal_payments.error_creating_withdrawal_flow_amount_above_maximum",
              {
                max: this.n(result.error.amountLimit, {
                  currency,
                  style: "currency",
                }),
              },
            ),
          };
        }
      }
      if (result.error.name === "ErrorWalletPaymentCooldownNotFinished") {
        const cooldownPeriodFinishesAt = new Date(
          Date.now() + result.error.cooldownSecondsLeft * 1000,
        );
        return {
          message: this.t(
            "modal_payments.error_creating_withdrawal_cooldown_not_finished",
            {
              dateTime: this.d(cooldownPeriodFinishesAt, {
                timeStyle: "short",
                dateStyle: "short",
              }),
            },
          ),
        };
      }

      if (result.error.name === "ErrorPaymentMethodNotAllowed") {
        return {
          message: this.t(
            "modal_payments.error_creating_withdrawal_flow_method_not_allowed",
          ),
        };
      }

      this.logger.error(
        "Error creating withdrawal flow on form submission",
        result.error,
        {
          currency,
          amount,
          paymentMethodId,
        },
      );
      return {
        message: this.t(
          "modal_payments.error_creating_withdrawal_flow_unknown",
        ),
      };
    }

    return { message: "" };
  }
}
