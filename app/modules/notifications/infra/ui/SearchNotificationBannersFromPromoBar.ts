import type { NotificationBannerRepositoryI } from "../../domain/NotificationBannerRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchNotificationBannersFromPromoBar {
  constructor(
    private notificationRepo: NotificationBannerRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle() {
    const resultSearching = await this.notificationRepo.search({ readStatus: "unread" });

    if (resultSearching.isFailure) {
      this.logger.error("Error searching for notifications from the promo bar", resultSearching.error);
      return;
    }

    return resultSearching.value.notifications;
  }
}
