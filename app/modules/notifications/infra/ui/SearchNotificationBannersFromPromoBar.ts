import type { NotificationRepositoryI } from "../../domain/NotificationRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchNotificationBannersFromPromoBar {
  constructor(
    private notificationRepo: NotificationRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle() {
    const resultSearching = await this.notificationRepo.searchPaginating(
      { readStatus: "unread", types: ["banner"] },
      100,
      0,
    );

    if (resultSearching.isFailure) {
      this.logger.error("Error searching for notifications from the promo bar", resultSearching.error);
      return;
    }

    return resultSearching.value.notifications;
  }
}
