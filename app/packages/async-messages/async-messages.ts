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
}
