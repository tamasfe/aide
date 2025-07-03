import type { CreateDepositFlow } from "../../application/CreateDepositFlow";
import type { NumberFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type SubmitErrorMessage = string;

export class CreateDepositFlowOnForm {
  constructor(
    private readonly createDepositFlow: CreateDepositFlow,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
    private readonly n: NumberFormatterFunctionType,
  ) {}

  public async handle(amount: number, currency: WalletCurrency, paymentMethodId: number): Promise<SubmitErrorMessage> {
    const result = await this.createDepositFlow.handle(amount, currency, paymentMethodId);
    if (result.isFailure) {
      if (result.error.name === "ErrorPendingPaymentFlow") {
        if (result.error.pendingPaymentType === "deposit") {
          return this.t("modal_payments.error_creating_flow_pending_deposit");
        }
        if (result.error.pendingPaymentType === "withdrawal") {
          return this.t("modal_payments.error_creating_flow_pending_withdrawal");
        }
      }

      if (result.error.name === "ErrorUserSandboxed") {
        return this.t("modal_payments.error_creating_flow_user_sandboxed");
      }

      if (result.error.name === "ErrorPaymentAmountExceedsTimeframeLimits") {
        // TODO: Use the error days and limit amount to format the message
        return this.t("modal_payments.error_creating_deposit_flow_amount_exceeds_timeframe_limits");
      }

      if (result.error.name === "ErrorPaymentAmountOutsideLimits") {
        if (result.error.limitExceeded === "min") {
          return this.t("modal_payments.error_creating_deposit_flow_amount_below_minimum", { min: this.n(result.error.amountLimit, { currency, style: "currency" }) });
        }
        if (result.error.limitExceeded === "max") {
          return this.t("modal_payments.error_creating_deposit_flow_amount_above_maximum", { max: this.n(result.error.amountLimit, { currency, style: "currency" }) });
        }
      }

      if (result.error.name === "ErrorPaymentMethodNotAllowed") {
        return this.t("modal_payments.error_creating_deposit_flow_method_not_allowed");
      }

      this.logger.error("Error creating deposit flow on form submission", result.error, {
        currency,
        amount,
        paymentMethodId,
      });
      return this.t("modal_payments.error_creating_deposit_flow_unknown");
    }

    return "";
  }
}
