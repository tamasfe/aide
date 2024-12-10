import type { PublicRuntimeConfig } from "nuxt/schema";
import { FindAuthenticatedUserWallet } from "../application/FindAuthenticatedUserWallet";
import type { WalletRepositoryI } from "../domain/WalletRepository";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { SearchPaymentsPaginating } from "../application/SearchPaymentsPaginating";
import { CreateDepositFlow } from "../application/CreateDepositFlow";
import type { PaymentMethodRepositoryI } from "../domain/PaymentMethodRepository";
import { CreateWithdrawalFlow } from "../application/CreateWithdrawalFlow";
import { WalletsRepositoryGirobet } from "./WalletsRepositoryGirobet";
import { WalletsRepositoryDumb } from "./WalletsRepositoryDumb";
import { PaymentRepositoryGirobet } from "./PaymentRepositoryGirobet";
import { PaymentRepositoryDumb } from "./PaymentRepositoryDumb";
import { SearchPaymentsOnTable } from "./ui/SearchPaymentsOnTable";
import { CreateDepositFlowOnForm } from "./ui/CreateDepositFlowOnForm";
import { FindPreferredPaymentMethodOnPaymentModal } from "./ui/FindPreferredPaymentMethodOnPaymentModal";
import { PaymentMethodRepositoryGirobet } from "./PaymentMethodRepositoryGirobet";
import { PaymentMethodRepositoryDumb } from "./PaymentMethodRepositoryDumb";
import { CreateWithdrawalFlowOnForm } from "./ui/CreateWithdrawalFlowOnForm";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface WalletsDependencyInjectionI {
  queries: {
    findAuthenticatedUserWallet: FindAuthenticatedUserWallet;
  };
  ui: {
    findPreferredPaymentMethodOnPaymentModal: FindPreferredPaymentMethodOnPaymentModal;
    createDepositFlowOnForm: CreateDepositFlowOnForm;
    createWithdrawalFlowOnForm: CreateWithdrawalFlowOnForm;
    searchPaymentsOnTable: SearchPaymentsOnTable;
  };
}

export const createWalletsDependencyInjection = (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): WalletsDependencyInjectionI => {
  const isServer = import.meta.server;

  const walletApiBaseUrl = isServer ? publicConfig.wallets.apiBaseUrlServer : publicConfig.wallets.apiBaseUrlClient;
  const walletsRepository: WalletRepositoryI = (() => {
    if (walletApiBaseUrl) {
      return new WalletsRepositoryGirobet({ baseUrl: walletApiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
    }
    return new WalletsRepositoryDumb();
  })();

  const paymentApiBaseUrl = isServer ? publicConfig.wallets.apiBaseUrlServer : publicConfig.wallets.apiBaseUrlClient;
  const paymentsRepository: PaymentRepositoryI = (() => {
    if (paymentApiBaseUrl) {
      return new PaymentRepositoryGirobet({ baseUrl: paymentApiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
    }
    return new PaymentRepositoryDumb();
  })();

  const paymentMethodsRepository: PaymentMethodRepositoryI = (() => {
    if (paymentApiBaseUrl) {
      return new PaymentMethodRepositoryGirobet({ baseUrl: paymentApiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
    }
    return new PaymentMethodRepositoryDumb();
  })();

  return {
    queries: {
      findAuthenticatedUserWallet: new FindAuthenticatedUserWallet(walletsRepository),
    },
    ui: {
      findPreferredPaymentMethodOnPaymentModal: new FindPreferredPaymentMethodOnPaymentModal(paymentMethodsRepository, commonDependencies.logger),
      createDepositFlowOnForm: new CreateDepositFlowOnForm(
        new CreateDepositFlow(paymentsRepository, commonDependencies.asyncMessagePublisher),
        commonDependencies.logger,
        commonDependencies.translateFunction,
      ),
      createWithdrawalFlowOnForm: new CreateWithdrawalFlowOnForm(
        new CreateWithdrawalFlow(paymentsRepository, commonDependencies.asyncMessagePublisher),
        commonDependencies.logger,
        commonDependencies.translateFunction,
        commonDependencies.dateTimeFormatter,
      ),
      searchPaymentsOnTable: new SearchPaymentsOnTable(
        new SearchPaymentsPaginating(paymentsRepository),
        commonDependencies.logger,
        commonDependencies.translateFunction,
        commonDependencies.dateTimeFormatter,
        commonDependencies.numberFormatter,
      ),
    },
  };
};
