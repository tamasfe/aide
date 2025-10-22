import { ErrorUserNotAuthorized } from "~/modules/wallet/domain/ErrorUserNotAuthorized";
import type { Wallet } from "~/modules/wallet/domain/Wallet";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

/**
 * Meaning of the different wallet states:
+ * - wallet === null => either loading/failed or loaded but user has no wallet yet.
+ *   When refresh() completes successfully with no wallet, wallet stays null.
 */
type WalletStoreI = {
  wallet: null | Wallet;
  currencies: WalletCurrency[];
};

export default defineStore("wallet", {
  state: (): WalletStoreI => ({
    wallet: null,
    currencies: [],
  }),

  getters: {
    balance: (state): number => {
      if (!state.wallet) {
        return 0;
      }
      return state.wallet.balance_locked + state.wallet.balance_unlocked + state.wallet.balance_bonus;
    },

    balanceBonus: (state): number => {
      if (!state.wallet) {
        return 0;
      }
      return state.wallet.balance_bonus;
    },

    activeCurrency: (state): WalletCurrency | null => {
      if (!state.wallet) {
        return state.currencies[0] ?? null;
      }
      return state.wallet.currency;
    },
  },

  actions: {
    async refresh() {
      const logger = useLogger();
      const walletModule = useWalletModule();

      this.wallet = null;

      const [result, currencies] = await Promise.all([
        walletModule.queries.findUserWallets.handle(),
        walletModule.queries.getAvailableCurrencies.handle(),
      ]);

      if (result.isFailure) {
        if (!(result.error instanceof ErrorUserNotAuthorized)) {
          logger.error("Unexpected error while fetching the wallet balances of the authenticated user", result.error);
        }

        this.wallet = null;
        return;
      }

      if (currencies.isFailure) {
        if (!(currencies.error instanceof ErrorUserNotAuthorized)) {
          logger.error("Unexpected error while fetching the available wallet currencies", currencies.error);
        }

        this.currencies = [];
        return;
      }

      this.wallet = result.value[0] ?? null;
      this.currencies = currencies.value;

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

      this.wallet.balance_bonus = balances.bonus;
      this.wallet.balance_locked = balances.locked;
      this.wallet.balance_unlocked = balances.unlocked;
      this.wallet.currency = currency;
    },
  },
});
