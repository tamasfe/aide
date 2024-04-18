import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notificationsList: [] as INotification[],
  }),
  getters: {
    getNotificationsList: state => state.notificationsList,
  },
  actions: {
    addNotification(notification: INotification) {
      this.notificationsList.push(notification as INotification);
    },
    removeNotification(index: number) {
      this.notificationsList.splice(index, 1);
    },
    removeAllNotifications() {
      this.notificationsList = [];
    },
  },
});
