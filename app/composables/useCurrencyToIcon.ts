import type { WalletCurrency } from "../modules/wallet/domain/WalletCurrency";
import type { SupportedCountryFlagCode } from "../types/constants";

export default function (currency: MaybeRef<WalletCurrency | null>) {
  const countryCode = computed<SupportedCountryFlagCode>(() => {
  // Simple mapping for now; in the future we might want to have a more complete mapping table
    switch (toValue(currency)) {
      default:
        return "BR";
    }
  });

  return countryCode;
}
