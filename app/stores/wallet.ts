import { ErrorUserNotAuthorized } from "~/modules/wallet/domain/ErrorUserNotAuthorized";
import type { Wallet } from "~/modules/wallet/domain/Wallet";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type WalletBalanceStatus = "ready" | "loading" | "hidden";

type WalletStoreI = {
  isInit: false | null; // null is used to indicate that the store is not initialized yet. false is used to indicate that the store is initialized but the user is not authenticated.
  balanceStatus: null;
  wallet: null;
} | {
  isInit: true;
  balanceStatus: WalletBalanceStatus;
  wallet: Wallet;
};

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStoreI => ({
    balanceStatus: null,
    isInit: null,
    wallet: null,
  }),

  getters: {
    balance: (state): number => {
      if (!state.wallet) {
        return 0;
      }
      return state.wallet.balanceLocked + state.wallet.balanceUnlocked + state.wallet.balanceBonus;
    },

    balanceBonus: (state): number => {
      if (!state.wallet) {
        return 0;
      }
      return state.wallet.balanceBonus;
    },
  },

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

    updateBalance(balances: {
      locked: number;
      unlocked: number;
      bonus: number;
    }, currency: WalletCurrency) {
      if (this.wallet === null) {
        return;
      }

      this.wallet.balanceBonus = balances.bonus;
      this.wallet.balanceLocked = balances.locked;
      this.wallet.balanceUnlocked = balances.unlocked;
      this.wallet.currency = currency;
    },
  },
});
