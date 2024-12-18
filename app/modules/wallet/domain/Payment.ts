import type { WalletCurrency } from "./WalletCurrency";

export type PaymentStatus = "pending" | "waiting_for_approval" | "approved" | "processing" | "completed" | "failed" | "cancelled" | "rejected" | "refunded";
export type PaymentType = "deposit" | "withdrawal";

interface PaymentPropsI {
  id: number;
  amount: number;
  createdAt: Date;
  currency: WalletCurrency;
  type: PaymentType;
  status: PaymentStatus | null;
  walletId: number;
}

export class Payment {
  public static new(props: PaymentPropsI): Payment {
    return new Payment(
      props.id,
      props.amount,
      props.createdAt,
      props.currency,
      props.type,
      props.status,
      props.walletId,
    );
  }

  private constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly createdAt: Date,
    public readonly currency: WalletCurrency,
    public readonly type: "deposit" | "withdrawal",
    public readonly status: PaymentStatus | null,
    public readonly walletId: number,
  ) {}

  public toJSON(): PaymentPropsI {
    return {
      id: this.id,
      amount: this.amount,
      createdAt: this.createdAt,
      currency: this.currency,
      type: this.type,
      status: this.status,
      walletId: this.walletId,
    };
  }
}
