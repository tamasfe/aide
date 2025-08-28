import type { PaymentMethodRepositoryI } from "../../domain/PaymentMethodRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

interface PaymentMethodWithLogoI {
  id: number;
  identifier: string;
  logo: string | null;
  title: string;
}

export class SearchPaymentMethodsOnDepositForm {
  constructor(
    private paymentMethodRepo: PaymentMethodRepositoryI,
    private logger: LoggerI,
  ) {}

  private getLogoForPaymentMethod(identifier: string): string | null {
    const logoMap: Record<string, string> = {
      pix: "logos/pix.svg",
      // Add more payment methods and their logos here as needed
    };

    return logoMap[identifier] || null;
  }

  public async handle(currency: WalletCurrency): Promise<PaymentMethodWithLogoI[]> {
    const paymentMethodsResult = await this.paymentMethodRepo.search(currency);

    if (paymentMethodsResult.isFailure) {
      this.logger.error("Error searching payment methods for deposit form", paymentMethodsResult.error);
      return [];
    }

    return paymentMethodsResult.value.map(paymentMethod => ({
      id: paymentMethod.id,
      identifier: paymentMethod.identifier,
      logo: this.getLogoForPaymentMethod(paymentMethod.identifier),
      title: paymentMethod.identifier,
    }));
  }
}
