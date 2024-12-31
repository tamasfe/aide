import type { PaymentStatus } from "~/modules/wallet/domain/Payment";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export interface WebsocketMessagesI {
  payment_status_update: {
    type: "notification";
    data: {
      type: "payment_status_update";
      data: {
        flow_id: number;
        status: PaymentStatus;
      };
    };
  };

  winning_now: {
    type: "ticker";
    data: {
      type: "winning_now";
      data: {
        amount: number;
        currency: WalletCurrency;
        user_nickname: string;
        game: {
          id: number;
          image_url: string;
          name: string;
          slug: string;
        };
      };
    };
  };
}
