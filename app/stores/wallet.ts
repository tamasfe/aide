import { ErrorUserNotAuthorized } from "~/modules/wallet/domain/ErrorUserNotAuthorized";

type WalletStoreI = {
  isInit: false;
  wallet: null;
} | {
  isInit: true;
  wallet: {
    balance: string;
    balanceValue: number;
    currency: string;
  };
};

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStoreI => ({
    isInit: false,
    wallet: null,
  }),

  actions: {
    async refresh() {
      const { $dependencies } = useNuxtApp();
      const result = await $dependencies.wallets.queries.findAuthenticatedUserWallet.handle();
      if (result.isFailure) {
        if (!(result.error instanceof ErrorUserNotAuthorized)) {
          $dependencies.common.logger.error("Unexpected error while fetching the wallet's balance of the authenticated user", { error: result.error });
        }
      }

      // Remove previous wallet
      if (result.isFailure || result.value === null) {
        this.isInit = false;
        this.wallet = null;
        return;
      }

      // Save wallet
      this.isInit = true;
      this.wallet = result.value;
      return;
    },
  },
});
