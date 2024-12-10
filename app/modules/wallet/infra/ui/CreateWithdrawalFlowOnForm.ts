import type { WalletCurrency } from "../../domain/WalletCurrency";
import type { CreateWithdrawalFlow } from "../../application/CreateWithdrawalFlow";
import type { DateTimeFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

type SubmitErrorMessage = string;

export class CreateWithdrawalFlowOnForm {
  constructor(
    private readonly createWithdrawalFlow: CreateWithdrawalFlow,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
    private readonly d: DateTimeFormatterFunctionType,
  ) {}

  public async handle(amount: number, currency: WalletCurrency, paymentMethodId: number): Promise<SubmitErrorMessage > {
    const result = await this.createWithdrawalFlow.handle(amount, currency, paymentMethodId);
    if (result.isFailure) {
      if (result.error.name === "ErrorPendingPaymentFlow") {
        if (result.error.pendingPaymentType === "deposit") {
          return this.t("modal_payments.error_creating_flow_pending_deposit");
        }
        if (result.error.pendingPaymentType === "withdrawal") {
          return this.t("modal_payments.error_creating_flow_pending_withdrawal");
        }
      }

      if (result.error.name === "ErrorInsufficientWagers") {
        return this.t("modal_payments.error_creating_withdrawal_insufficient_wagers");
      }

      if (result.error.name === "ErrorInsufficientFunds") {
        return this.t("modal_payments.error_creating_withdrawal_insufficient_funds");
      }

      if (result.error.name === "ErrorPaymentCooldownNotFinished") {
        const cooldownPeriodFinishesAt = new Date(Date.now() + result.error.cooldownMinutesLeft * 60 * 1000);
        return this.t("modal_payments.error_creating_withdrawal_cooldown_not_finished", {
          dateTime: this.d(cooldownPeriodFinishesAt, { timeStyle: "short", dateStyle: "short" }),
        });
      }

      this.logger.error("Error creating withdrawal flow on form submission", result.error, {
        currency,
        amount,
        paymentMethodId,
      });
      return this.t("modal_payments.error_creating_withdrawal_flow_unknown");
    }

    return "";
  }
}
