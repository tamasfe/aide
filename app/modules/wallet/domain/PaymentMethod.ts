export type PaymentMethodIdentifier = "pix";

export interface PaymentMethodI {
  id: number;
  identifier: PaymentMethodIdentifier;
}
