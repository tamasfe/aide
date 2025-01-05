import type { NotificationBackendRepositoryI } from "../../domain/NotificationBackendRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class MarkNotificationToastAsRead {
  constructor(
    private notificationRepo: NotificationBackendRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle(notificationId: number) {
    const resultUpdating = await this.notificationRepo.updateReadStatus(
      notificationId,
      "read",
    );

    if (resultUpdating.isFailure) {
      this.logger.error("Error marking notification as read", resultUpdating.error);
      return;
    }

    return;
  }
}
