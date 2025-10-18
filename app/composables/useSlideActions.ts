export default function () {
  const userStore = useUserStore();
  const nuxtApp = useNuxtApp();

  const openDepositOrLogin = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
      return;
    }
    nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "login" });
  };

  const openWithdrawalOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "withdrawal" });
      return;
    }
    nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
  };

  const openDepositOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
      return;
    }
    nuxtApp.callHook("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
  };

  return {
    openDepositOrLogin,
    openWithdrawalOrRegister,
    openDepositOrRegister,
  };
};
