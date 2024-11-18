import { ErrorUserNotAuthorized } from "~/modules/wallet/domain/ErrorUserNotAuthorized";

type WalletBalanceStatus = "ready" | "loading" | "hidden";

type WalletStoreI = {
  isInit: false;
  balanceStatus: null;
  wallet: null;
} | {
  isInit: true;
  balanceStatus: WalletBalanceStatus;
  wallet: {
    id: number;
    balance: number;
    currency: string;
  };
};

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStoreI => ({
    balanceStatus: null,
    isInit: false,
    wallet: null,
  }),

  actions: {
    async refresh() {
      const { $dependencies } = useNuxtApp();
      this.balanceStatus = "loading";
      const result = await $dependencies.wallets.queries.findAuthenticatedUserWallet.handle();
      if (result.isFailure) {
        if (!(result.error instanceof ErrorUserNotAuthorized)) {
          $dependencies.common.logger.error("Unexpected error while fetching the wallet's balance of the authenticated user", result.error);
        }
      }

      // Remove previous wallet
      if (result.isFailure || result.value === null) {
        this.isInit = false;
        this.wallet = null;
        this.balanceStatus = null;
        return;
      }

      // Save wallet
      this.wallet = result.value;
      this.balanceStatus = "ready";
      this.isInit = true;
      return;
    },

    async hideBalance() {
      this.balanceStatus = "hidden";
    },
  },
});
