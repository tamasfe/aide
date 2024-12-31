import type { NotificationRepositoryI } from "../../domain/NotificationRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class MarkNotificationBannerAsReadFromPromoBar {
  constructor(
    private notificationRepo: NotificationRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle(notificationId: number) {
    const resultUpdating = await this.notificationRepo.updateReadStatus(
      notificationId,
      "read",
    );

    if (resultUpdating.isFailure) {
      this.logger.error("Error marking banner notification as read", resultUpdating.error);
      return;
    }

    return;
  }
}
