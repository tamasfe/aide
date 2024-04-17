import { defineStore } from "pinia";

export const useTriggersStore = defineStore("globalTriggers", {
  state: () => ({
    openAuthModal: false,
    authModalType: "register",
    showPromoNotification: true,
    blockScroll: false,
    showSideMenu: false,
    sideMenuType: 'search',
  }),
  getters: {
    getAuthModalOpen: state => state.openAuthModal,
    getAuthModalType: state => state.authModalType,
    getPromoNotificationOpen: state => state.showPromoNotification,
    getStopScroll: state => state.blockScroll,
    getShowSideMenu: state => state.showSideMenu,
    getSideMenuType: state => state.sideMenuType
  },
  actions: {
    setAuthModalState(modalShow) {
      this.openAuthModal = modalShow;
    },
    setAuthModalType(modalType) {
      this.authModalType = modalType;
    },
    setPromoNotificationState(notificationShow) {
      this.showPromoNotification = notificationShow;
    },
    setStopScrollState(blockScroll) {
      this.blockScroll = blockScroll;
    },
    setSideMenuState(showSideMenu) {
      this.showSideMenu = showSideMenu
    },
    setSideMenuType(sideMenuType) {
      this.sideMenuType = sideMenuType
    }
  },
});
