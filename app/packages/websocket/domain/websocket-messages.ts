import type { PaymentStatus } from "~/modules/wallet/domain/Payment";

export interface WebsocketMessagesI {
  payment_status_update: {
    event: "notification";
    payload: {
      data: {
        flow_id: number;
        status: PaymentStatus;
      };
      type: "payment_status_update";
    };
  };
}
