import type { PublicRuntimeConfig } from "nuxt/schema";
import { FindAuthenticatedUserWallet } from "../application/FindAuthenticatedUserWallet";
import type { WalletRepositoryI } from "../domain/WalletRepository";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import { SearchPaymentsPaginating } from "../application/SearchPaymentsPaginating";
import { CreateDepositFlow } from "../application/CreateDepositFlow";
import { WalletsRepositoryGirobet } from "./WalletsRepositoryGirobet";
import { WalletsRepositoryDumb } from "./WalletsRepositoryDumb";
import { PaymentRepositoryGirobet } from "./PaymentRepositoryGirobet";
import { PaymentRepositoryDumb } from "./PaymentRepositoryDumb";
import { SearchPaymentsOnTable } from "./ui/SearchPaymentsOnTable";
import { CreatePixDepositFlowOnForm } from "./ui/CreatePixDepositFlowOnForm";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface WalletsDependencyInjectionI {
  queries: {
    findAuthenticatedUserWallet: FindAuthenticatedUserWallet;
  };
  ui: {
    createPixDepositFlowOnForm: CreatePixDepositFlowOnForm;
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

  return {
    queries: {
      findAuthenticatedUserWallet: new FindAuthenticatedUserWallet(walletsRepository),
    },
    ui: {
      createPixDepositFlowOnForm: new CreatePixDepositFlowOnForm(
        new CreateDepositFlow(paymentsRepository, commonDependencies.asyncMessagePublisher),
        commonDependencies.logger,
        commonDependencies.translateFunction,
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
