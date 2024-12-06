import type { SupportedLocale } from "../translation";
import type { PaymentStatus } from "~/modules/wallet/domain/Payment";

export interface AsyncMessagesTypes {
  "girobet:commands:modals:open-login": object;
  "girobet:commands:modals:open-register": object;
  "girobet:commands:modals:open-restrict-expanding": { jurisdiction: string };
  "girobet:commands:modals:open-restrict-alternative": {
    jurisdiction: string;
    allowedDomain: string;
  };
  "girobet:commands:modals:open-restrict-no-alternative": { jurisdiction: string };
  "girobet:commands:modals:open-search": object;
  "girobet:commands:modals:open-recover-password": { token: string };
  "girobet:commands:modals:open-forgot-password": object;
  "girobet:commands:modals:open-deposit": object;
  "girobet:commands:modals:open-deposit-confirm": object;
  "girobet:commands:modals:open-withdrawal": object;
  "girobet:commands:modals:open-update-settings": { setting: "password" };
  "girobet:commands:modals:close-user-interaction-modal": object;

  "girobet:events:users:user-logged-in": object;
  "girobet:events:users:user-logged-out": object;
  "girobet:events:users:password-recovered": object;
  "girobet:events:users:user-settings-updated": {
    settings: {
      locale?: SupportedLocale;
      password: boolean;
      consents?: {
        email?: boolean | null;
        postMail?: boolean | null;
        pushNotification?: boolean | null;
        siteNotification?: boolean | null;
        sms?: boolean | null;
        telephone?: boolean | null;
      };
    };
  };

  "girobet:events:signup-flows:signup-flow-submitted": {
    id: string;
  };

  "girobet:events:games:game-session-started": {
    gameId: number;
  };
  "girobet:events:games:game-session-finished": {
    gameId: number;
  };

  "girobet:events:payments:deposit-flow-created": {
    paymentMethodId: number;
    flowId: string;
    code: string;
  };

  "girobet:events:websockets:connection-errored": {
    channel: "user" | "newest_wins";
  };

  /**
   * Events coming from the Backend
   */
  "girobet-backend:events:payments:payment-status-updated": {
    flowId: number;
    status: PaymentStatus;
  };
}
