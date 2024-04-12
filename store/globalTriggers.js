import { defineStore } from 'pinia'

export const useTriggersStore = defineStore('globalTriggers', {
  state: () => ({
     openAuthModal: false,
     authModalType: 'register'
  }),
  getters: {
    getAuthModalOpen: (state) => state.openAuthModal,
    getAuthModalType: (state) => state.authModalType
  },
  actions: {
    setAuthModalState(modalShow) {
      this.openAuthModal = modalShow
    },
    setAuthModalType(modalType) {
      this.authModalType = modalType
    }
  },
})