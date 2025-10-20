export default function () {
  const userStore = useUserStore();
  const nuxtApp = useNuxtApp();

  const openDepositOrLogin = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:open", { modal: "deposit" });
      return;
    }
    nuxtApp.callHook("frontend:command:modal:open", { modal: "login" });
  };

  const openWithdrawalOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:open", { modal: "withdrawal" });
      return;
    }
    nuxtApp.callHook("frontend:command:modal:open", { modal: "register" });
  };

  const openDepositOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:open", { modal: "deposit" });
      return;
    }
    nuxtApp.callHook("frontend:command:modal:open", { modal: "register" });
  };

  return {
    openDepositOrLogin,
    openWithdrawalOrRegister,
    openDepositOrRegister,
  };
};
