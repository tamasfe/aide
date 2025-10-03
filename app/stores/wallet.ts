import { ErrorUserNotAuthorized } from "~/modules/wallet/domain/ErrorUserNotAuthorized";
import type { Wallet } from "~/modules/wallet/domain/Wallet";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type WalletBalanceStatus = "ready" | "loading";

/**
 * Meaning of the different wallet states:
 * - wallet === undefined => not init or error loading it ("not defined")
 * - wallet === null => loaded correctly but user does not have a wallet yet. This is the case for new users before their first deposit.
 * - wallet === truthy => wallet loaded correctly
 */
type WalletStoreI = {
  balanceStatus: WalletBalanceStatus;
  wallet: undefined | null | Wallet;
};

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStoreI => ({
    balanceStatus: "loading",
    wallet: undefined,
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
      this.wallet = undefined;

      const result = await $dependencies.wallets.queries.findAuthenticatedUserWallet.handle();
      if (result.isFailure) {
        if (!(result.error instanceof ErrorUserNotAuthorized)) {
          $dependencies.common.logger.error("Unexpected error while fetching the wallet's balance of the authenticated user", result.error);
        }
      }

      // Remove previous wallet
      if (result.isFailure) {
        this.wallet = undefined;
        this.balanceStatus = "ready";
        return;
      }

      // New user without payments: no wallet yet
      if (result.value === null) {
        this.wallet = null;
        this.balanceStatus = "ready";
        return;
      }

      // Save wallet
      this.wallet = result.value;
      this.balanceStatus = "ready";

      return;
    },

    updateBalance(balances: {
      locked: number;
      unlocked: number;
      bonus: number;
    }, currency: WalletCurrency) {
      if (!this.wallet) {
        return;
      }

      this.wallet.balanceBonus = balances.bonus;
      this.wallet.balanceLocked = balances.locked;
      this.wallet.balanceUnlocked = balances.unlocked;
      this.wallet.currency = currency;
    },
  },
});
