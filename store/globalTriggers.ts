import { defineStore } from "pinia";

export const useTriggersStore = defineStore("globalTriggers", {
  state: () => ({
    openAuthModal: false,
    authModalType: "register",
    showPromoNotification: true,
    blockScroll: false,
    showSideMenu: false,
    sideMenuType: "search",
  }),
  getters: {
    getAuthModalOpen: state => state.openAuthModal,
    getAuthModalType: state => state.authModalType,
    getPromoNotificationOpen: state => state.showPromoNotification,
    getStopScroll: state => state.blockScroll,
    getShowSideMenu: state => state.showSideMenu,
    getSideMenuType: state => state.sideMenuType,
  },
  actions: {
    setAuthModalState(modalShow: boolean) {
      this.openAuthModal = modalShow;
    },
    setAuthModalType(modalType: string) {
      this.authModalType = modalType;
    },
    setPromoNotificationState(notificationShow: boolean) {
      this.showPromoNotification = notificationShow;
    },
    setStopScrollState(blockScroll: boolean) {
      this.blockScroll = blockScroll;
    },
    setSideMenuState(showSideMenu: boolean) {
      this.showSideMenu = showSideMenu;
    },
    setSideMenuType(sideMenuType: string) {
      this.sideMenuType = sideMenuType;
    },
  },
});
