import type { RouteLocationRaw } from "vue-router";

export interface SlideData {
  id: string;
  imagePath: string;
  alt?: string;
  action: {
    type: "link" | "callback";
    attributes: {
      to?: RouteLocationRaw;
      onClick?: () => void;
      [key: string]: unknown;
    };
  };
  fetchpriority?: "high" | "low" | "auto";
}

export interface SlideActionCallbacks {
  openDepositOrLogin: () => void;
  openWithdrawalOrRegister: () => void;
  openDepositOrRegister: () => void;
}
