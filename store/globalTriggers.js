import { defineStore } from 'pinia'

export const useTriggersStore = defineStore('globalTriggers', {
  state: () => ({
     openAuthModal: false,
     authModalType: 'register',
     showPromoNotification: true
  }),
  getters: {
    getAuthModalOpen: (state) => state.openAuthModal,
    getAuthModalType: (state) => state.authModalType,
    getPromoNotificationOpen: (state) => state.showPromoNotification
  },
  actions: {
    setAuthModalState(modalShow) {
      this.openAuthModal = modalShow
    },
    setAuthModalType(modalType) {
      this.authModalType = modalType
    },
    setPromoNotificationState(notificationShow) {
      this.showPromoNotification = notificationShow
    }
  },
})