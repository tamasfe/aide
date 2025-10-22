export default function () {
  const userStore = useUserStore();
  const nuxtApp = useNuxtApp();

  const openDepositOrLogin = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:deposit:open");
      return;
    }
    nuxtApp.callHook("frontend:command:modal:login:open");
  };

  const openWithdrawalOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:withdraw:open");
      return;
    }
    nuxtApp.callHook("frontend:command:modal:register:open");
  };

  const openDepositOrRegister = () => {
    if (userStore.user) {
      nuxtApp.callHook("frontend:command:modal:deposit:open");
      return;
    }
    nuxtApp.callHook("frontend:command:modal:register:open");
  };

  return {
    openDepositOrLogin,
    openWithdrawalOrRegister,
    openDepositOrRegister,
  };
};
