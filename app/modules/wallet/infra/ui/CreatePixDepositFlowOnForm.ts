import type { CreateDepositFlow } from "../../application/CreateDepositFlow";
import type { TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

type SubmitErrorMessage = string;

export class CreatePixDepositFlowOnForm {
  constructor(
    private readonly createDepositFlow: CreateDepositFlow,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
  ) {}

  public async handle(amount: number): Promise<SubmitErrorMessage > {
    const result = await this.createDepositFlow.handle(amount, "BRL", "pix");
    if (result.isFailure) {
      if (result.error.name === "ErrorPendingPaymentFlow") {
        if (result.error.pendingPaymentType === "deposit") {
          return this.t("modal_payments.error_creating_flow_pending_deposit");
        }
        if (result.error.pendingPaymentType === "withdrawal") {
          return this.t("modal_payments.error_creating_flow_pending_withdrawal");
        }
      }

      this.logger.error("Error creating deposit flow on form submission", result.error, {
        currency: "BRL",
        amount,
        paymentMethod: "pix",
      });
      return this.t("modal_payments.error_creating_deposit_flow_unknown");
    }

    return "";
  }
}
