import type { NotificationToast } from "~/modules/notifications/domain/NotificationToast";

const TOAST_DURATION = 6 * 1000; // Up to us

type NotificationsStoreState = {
  toasts: NotificationToast[];
};

export default defineStore("notification", {
  state: (): NotificationsStoreState => ({
    toasts: [],
  }),

  actions: {
    showToast(notificationToast: NotificationToast) {
      this.toasts.push(notificationToast);
      setTimeout(() => this.clearToast(notificationToast.id), TOAST_DURATION);
    },

    clearToast(id: number | string) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
      const notificationModule = useNotificationModule();
      // No need to await and make UX slower, if it fails: an error log is emitted from the UI handler
      // Only mark as read if the id is a number (backend notifications)
      if (typeof id === "number") {
        notificationModule.ui.markNotificationToastAsRead.handle(id);
      }
    },
  },
});
