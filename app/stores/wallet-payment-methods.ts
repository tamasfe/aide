import type { PaymentLimits } from "~/modules/wallet/domain/PaymentLimits";
import type { PaymentMethodWithLogo } from "~/modules/wallet/domain/PaymentMethod";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type ReadyState = {
  status: "ready";
  currency: WalletCurrency;
  preferred: PaymentMethodWithLogo;
  methods: PaymentMethodWithLogo[];
  limits: PaymentLimits;
};

type WalletPaymentMethodsStoreState
  = | ReadyState
    | {
      status: "unititialized" | "loading";
      currency: null;
      preferred: null;
      methods: PaymentMethodWithLogo[];
      limits: null;
    };

export const useWalletPaymentMethodsStore = defineStore("walletPaymentMethodsStore", {
  state: (): WalletPaymentMethodsStoreState => ({
    status: "unititialized",
    currency: null,
    preferred: null,
    methods: [],
    limits: null,
  }),

  actions: {
    async refresh(state: null | Omit<ReadyState, "status">) {
      if (!state) {
        this.status = "unititialized";
        this.currency = null;
        this.preferred = null;
        this.methods = [];
        this.limits = null;
        return;
      }

      this.status = "ready";
      this.currency = state.currency;
      this.preferred = state.preferred;
      this.methods = state.methods;
      this.limits = state.limits;
    },

    setLoading() {
      this.status = "loading";
      this.currency = null;
      this.preferred = null;
      this.methods = [];
      this.limits = null;
    },
  },
});
