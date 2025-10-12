export const useSlideActions = () => {
  const { $dependencies } = useNuxtApp();
  const userStore = useUserStore();

  const openDepositOrLogin = () => {
    if (userStore.user) {
      $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
      return;
    }
    $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "login" });
  };

  const openWithdrawalOrRegister = () => {
    if (userStore.user) {
      $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "withdrawal" });
      return;
    }
    $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
  };

  const openDepositOrRegister = () => {
    if (userStore.user) {
      $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
      return;
    }
    $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "register" });
  };

  return {
    openDepositOrLogin,
    openWithdrawalOrRegister,
    openDepositOrRegister,
  };
};
