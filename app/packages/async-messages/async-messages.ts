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
  "girobet:commands:modals:close-user-interaction-modal": object;

  "girobet:events:users:user-logged-in": object;
  "girobet:events:users:user-logged-out": object;

  "girobet:events:games:game-session-started": {
    gameId: number;
  };
  "girobet:events:games:game-session-finished": {
    gameId: number;
  };
}
