import type { SearchPaymentsPaginating } from "../../application/SearchPaymentsPaginating";
import type { DateTimeFormatterFunctionType, NumberFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

export type WalletPaymentTableData = {
  id: number;
  date: string;
  type: string;
  status: string;
  amount: string;
};

export class SearchPaymentsOnTable {
  constructor(
    private readonly query: SearchPaymentsPaginating,
    private logger: LoggerI,
    private t: TranslateFunctionType,
    private d: DateTimeFormatterFunctionType,
    private n: NumberFormatterFunctionType,
  ) {}

  public PAGE_SIZE = 24;

  public async handle(walletId: number | null, type: "deposit" | "withdrawal" | null, pageIndex: number, pageSize: number = this.PAGE_SIZE): Promise<{
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    payments: WalletPaymentTableData[];
  }> {
    const result = await this.query.handle(walletId, type, pageIndex, pageSize);
    if (result.isFailure) {
      this.logger.error("Unexpected error while trying to search for payments", result.error, { pageIndex, pageSize: pageSize });
      return {
        pageIndex,
        pageSize,
        totalItems: 0,
        payments: [],
      };
    }

    return {
      pageIndex,
      pageSize,
      totalItems: result.value.pagination.totalItems,
      payments: result.value.payments.map((payment) => {
        /**
         * This switch is here to remember to add the translation key when adding new payment statuses
         * The moment we add one: a type error will appear here and we will remember to add the translation key.
         */
        const status: string = (() => {
          if (payment.status === null) {
            return "";
          }
          switch (payment.status) {
            case "waiting_for_approval":
            case "approved":
            case "processing":
            case "succeeded":
            case "failed":
            case "rejected":
            case "refunded":
            case "initiated":
              return this.t(`wallet.payment.status.${payment.status}`);
          }
        })();

        /**
         * This switch is here to remember to add the translation key when adding new payment types.
         * The moment we add one: a type error will appear here and we will remember to add the translation key.
         */
        const type: string = (() => {
          switch (payment.type) {
            case "deposit":
            case "withdrawal":
              return this.t(`wallet.payment.type.${payment.type}`);
          }
        })();

        return {
          id: payment.id,
          date: this.d(payment.createdAt.toISOString(), { dateStyle: "medium" }),
          type: type.toUpperCase(),
          status: status.toUpperCase(),
          amount: this.n(payment.amount, { key: "currency", currency: payment.currency }),
        };
      }),
    };
  }
}
