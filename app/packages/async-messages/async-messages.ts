import type { SupportedLocale } from "../translation";

export interface AsyncMessagesTypes {
  "girobet:commands:modals:open-login": object;
  "girobet:commands:modals:open-register": object;
  "girobet:commands:modals:open-restrict-expanding": {
    jurisdiction: string;
  };
  "girobet:commands:modals:open-restrict-alternative": {
    jurisdiction: string;
    allowedDomain: string;
  };
  "girobet:commands:modals:open-restrict-network-issues": {
    jurisdiction: string;
  };
  "girobet:commands:modals:open-search": object;
  "girobet:commands:modals:open-recover-password": { token: string };
  "girobet:commands:modals:open-forgot-password": object;
  "girobet:commands:modals:open-deposit": object;
  "girobet:commands:modals:open-deposit-confirm": object;
  "girobet:commands:modals:open-withdrawal": object;
  "girobet:commands:modals:close-user-interaction-modal": object;

  "girobet:events:users:user-logged-in": object;
  "girobet:events:users:user-logged-out": object;
  "girobet:events:users:password-recovered": object;
  "girobet:events:users:user-settings-updated": {
    settings: {
      locale?: SupportedLocale;
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
    paymentMethod: "pix";
    flowId: string;
    code: string;
  };
}
