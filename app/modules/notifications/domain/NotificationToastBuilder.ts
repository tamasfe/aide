import type { NotificationBackend } from "./NotificationBackend";
import type { NotificationToast } from "./NotificationToast";
import type { TranslateFunctionType } from "~/packages/translation";

export class NotificationToastBuilder {
  constructor(private t: TranslateFunctionType) {}

  public buildFromBackendNotification(notification: NotificationBackend): NotificationToast | null {
    if (notification.type === "payment_status_update") {
      switch (notification.data.status) {
        case "succeeded":
          return {
            id: notification.id,
            createdAt: new Date(notification.createdAt),
            title: this.t("notifications.payment_updated.completed.title"),
            message: this.t("notifications.payment_updated.completed.message"),
            variant: "success",
          };

        case "rejected":
          return {
            id: notification.id,
            createdAt: new Date(notification.createdAt),
            title: this.t("notifications.payment_updated.rejected.title"),
            message: this.t("notifications.payment_updated.rejected.message"),
            variant: "error",
          };

        case "failed":
          return {
            id: notification.id,
            createdAt: new Date(notification.createdAt),
            title: this.t("notifications.payment_updated.failed.title"),
            message: this.t("notifications.payment_updated.failed.message"),
            variant: "error",
          };

        case "waiting_for_approval":
          return {
            id: notification.id,
            createdAt: new Date(notification.createdAt),
            title: this.t("notifications.payment_updated.waiting_for_approval.title"),
            message: this.t("notifications.payment_updated.waiting_for_approval.message"),
            variant: "info",
          };

        default:
          return null;
      }
    }

    if (notification.type === "banner") {
      // The banners for now are dealt in the frontend from another repository
      return null;
    }

    if (notification.type === "kyc_completed") {
      return {
        id: notification.id,
        createdAt: new Date(notification.createdAt),
        title: this.t("notifications.kyc_completed.title"),
        message: this.t("notifications.kyc_completed.message"),
        variant: "success",
      };
    }

    return null;
  }
}
