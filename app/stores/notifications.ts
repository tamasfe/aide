import type { NotificationToast } from "~/modules/notifications/domain/NotificationToast";

const TOAST_DURATION = 30 * 1000; // Up to us

type NotificationsStoreState = {
  toasts: NotificationToast[];
};

export const useNotificationsStore = defineStore("useNotificationsStore", {
  state: (): NotificationsStoreState => ({
    toasts: [],
  }),

  actions: {
    showToast(notificationToast: NotificationToast) {
      this.toasts.push(notificationToast);
      setTimeout(() => this.clearToast(notificationToast.id), TOAST_DURATION);
    },

    clearToast(id: number) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    },
  },
});
