import type { AsyncMessagesTypes } from "~/packages/async-messages/async-messages";
import type { TranslateFunctionType } from "~/packages/translation";
import type { PiniaStore } from "~/types/utils";

export class ShowNotificationToastToStoreFromPaymentUpdated {
  constructor(
    private notificationsStore: PiniaStore<typeof useNotificationsStore>,
    private t: TranslateFunctionType,
  ) {}

  public async handle(eventData: AsyncMessagesTypes["girobet-backend:events:payments:payment-status-updated"]) {
    switch (eventData.status) {
      case "completed":
        this.notificationsStore.showToast({
          id: eventData.notificationId,
          title: this.t("notifications.payment_updated.completed.title"),
          message: this.t("notifications.payment_updated.completed.message"),
          variant: "success",
        });
        break;
      case "rejected":
        this.notificationsStore.showToast({
          id: eventData.notificationId,
          title: this.t("notifications.payment_updated.rejected.title"),
          message: this.t("notifications.payment_updated.rejected.message"),
          variant: "error",
        });
        break;
      case "failed":
        this.notificationsStore.showToast({
          id: eventData.notificationId,
          title: this.t("notifications.payment_updated.failed.title"),
          message: this.t("notifications.payment_updated.failed.message"),
          variant: "error",
        });
        break;

      default:
        // Not alert the user
        break;
    }
  }
}
