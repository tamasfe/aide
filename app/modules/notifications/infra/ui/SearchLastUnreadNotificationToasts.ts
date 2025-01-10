import type { NotificationBackendRepositoryI } from "../../domain/NotificationBackendRepository";
import type { NotificationToast } from "../../domain/NotificationToast";
import type { NotificationToastBuilder } from "../../domain/NotificationToastBuilder";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchLastUnreadNotificationToasts {
  constructor(
    private notificationRepo: NotificationBackendRepositoryI,
    private notificationToastBuilder: NotificationToastBuilder,
    private logger: LoggerI,
  ) {}

  public async handle(): Promise<NotificationToast[]> {
    const resultSearching = await this.notificationRepo.searchPaginating({ readStatus: "unread" }, 7, 0);

    if (resultSearching.isFailure) {
      this.logger.error("Error searching for notifications toasts", resultSearching.error);
      return [];
    }

    const toasts = resultSearching.value.notifications.map(notificationData => this.notificationToastBuilder.buildFromBackendNotification(notificationData));

    return toasts.filter(toast => toast !== null);
  }
}
