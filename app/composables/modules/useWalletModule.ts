import type { WalletRepositoryI } from "~/modules/wallet/domain/WalletRepository";
import { WalletsRepositoryDumb } from "../../modules/wallet/infra/WalletsRepositoryDumb";
import { WalletsRepositoryGirobet } from "../../modules/wallet/infra/WalletsRepositoryGirobet";
import { PaymentRepositoryDumb } from "~/modules/wallet/infra/PaymentRepositoryDumb";
import { PaymentMethodRepositoryDumb } from "~/modules/wallet/infra/PaymentMethodRepositoryDumb";
import { PaymentMethodRepositoryGirobet } from "~/modules/wallet/infra/PaymentMethodRepositoryGirobet";
import { PaymentRepositoryGirobet } from "~/modules/wallet/infra/PaymentRepositoryGirobet";
import type { PaymentRepositoryI } from "~/modules/wallet/domain/PaymentRepository";
import type { PaymentMethodRepositoryI } from "~/modules/wallet/domain/PaymentMethodRepository";
import { FindAuthenticatedUserWallet } from "~/modules/wallet/application/FindAuthenticatedUserWallet";
import { FindPreferredPaymentMethodOnStoreRefresh } from "~/modules/wallet/infra/ui/FindPreferredPaymentMethodOnPaymentModal";
import { CreateDepositFlowOnForm } from "~/modules/wallet/infra/ui/CreateDepositFlowOnForm";
import { CreateWithdrawalFlowOnForm } from "~/modules/wallet/infra/ui/CreateWithdrawalFlowOnForm";
import { SearchPaymentsOnTable } from "~/modules/wallet/infra/ui/SearchPaymentsOnTable";

import { CreateWithdrawalFlow } from "~/modules/wallet/application/CreateWithdrawalFlow";
import { CreateDepositFlow } from "~/modules/wallet/application/CreateDepositFlow";
import { SearchPaymentsPaginating } from "~/modules/wallet/application/SearchPaymentsPaginating";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient, $i18n } = useNuxtApp();
  const logger = useLogger();
  const nuxtApp = useNuxtApp();

  const walletsRepository: WalletRepositoryI = (() => {
    switch (runtimeConfig.public.wallets.apiMode) {
      case "mock":
        return new WalletsRepositoryDumb();
      default:
        return new WalletsRepositoryGirobet($apiClient);
    }
  })();

  const paymentsRepository: PaymentRepositoryI = (() => {
    switch (runtimeConfig.public.wallets.apiMode) {
      case "mock":
        return new PaymentRepositoryDumb();
      default:
        return new PaymentRepositoryGirobet($apiClient);
    }
  })();

  const paymentMethodsRepository: PaymentMethodRepositoryI = (() => {
    switch (runtimeConfig.public.wallets.apiMode) {
      case "mock":
        return new PaymentMethodRepositoryDumb();
      default:
        return new PaymentMethodRepositoryGirobet($apiClient);
    }
  })();

  return {
    queries: {
      findAuthenticatedUserWallet: new FindAuthenticatedUserWallet(
        walletsRepository,
      ),
    },
    ui: {
      findPreferredPaymentMethodsOnStoreRefresh:
        new FindPreferredPaymentMethodOnStoreRefresh(
          paymentMethodsRepository,
          logger,
        ),
      createDepositFlowOnForm: new CreateDepositFlowOnForm(
        new CreateDepositFlow(paymentsRepository, nuxtApp),
        logger,
        $i18n.t,
        $i18n.n,
      ),
      createWithdrawalFlowOnForm: new CreateWithdrawalFlowOnForm(
        new CreateWithdrawalFlow(paymentsRepository, nuxtApp),
        nuxtApp,
        logger,
        $i18n.t,
        $i18n.d,
        $i18n.n,
      ),
      searchPaymentsOnTable: new SearchPaymentsOnTable(
        new SearchPaymentsPaginating(paymentsRepository),
        logger,
        $i18n.t,
        $i18n.d,
        $i18n.n,
      ),
    },
  };
}
