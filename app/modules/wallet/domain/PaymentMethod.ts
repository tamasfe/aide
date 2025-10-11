export type PaymentMethodIdentifier = "pix";

export interface PaymentMethodI {
  id: number;
  identifier: PaymentMethodIdentifier;
}

export type PaymentMethodWithLogo = PaymentMethodI & {
  logo: string | null;
  title: string;
};

export const addLogoToPaymentMethod = (method: PaymentMethodI): PaymentMethodWithLogo => {
  const logoMap = {
    pix: "logos/pix.svg",
    // Add more payment methods and their logos here as needed
  };

  return {
    ...method,
    logo: logoMap[method.identifier] || null,
    title: method.identifier,
  };
};
