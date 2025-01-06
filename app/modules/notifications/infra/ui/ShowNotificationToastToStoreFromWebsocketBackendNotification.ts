import type { NotificationBackend } from "../../domain/NotificationBackend";
import type { NotificationToastBuilder } from "../../domain/NotificationToastBuilder";
import type { PiniaStore } from "~/types/utils";

export class ShowNotificationToastToStoreFromWebsocketBackendNotification {
  constructor(
    private notificationsStore: PiniaStore<typeof useNotificationsStore>,
    private notificationToastBuilder: NotificationToastBuilder,
  ) {}

  public async handle(backendNotification: NotificationBackend) {
    const toastToShow = this.notificationToastBuilder.buildFromBackendNotification(backendNotification);
    if (toastToShow === null) {
      return;
    }
    this.notificationsStore.showToast(toastToShow);
  }
}
