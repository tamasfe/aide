import type { NotificationBackendRepositoryI } from "../domain/NotificationBackendRepository";
import type { NotificationBackend } from "../domain/NotificationBackend";
import type { ErrorRetrievingNotifications } from "../domain/ErrorRetrievingNotifications";
import type { ErrorNotificationNotFound } from "../domain/ErrorNotificationNotFound";
import type { ErrorSavingNotification } from "../domain/ErrorSavingNotification";
import { success, type EmptyResult, type Result } from "~/packages/result";

export class NotificationBackendRepositoryDumb implements NotificationBackendRepositoryI {
  public async searchPaginating(_searchParams: {
    readStatus: "read" | "unread" | null;
    types: NotificationBackend["type"][] | null;
  },
  limit: number, offset: number,
  ): Promise<Result<
      {
        notifications: NotificationBackend[];
        pagination: {
          limit: number;
          offset: number;
          totalItems: number;
        };
      },
      ErrorRetrievingNotifications
    >> {
    return success({
      notifications: [],
      pagination: {
        limit,
        offset,
        totalItems: 0,
      },
    });
  }

  public async updateReadStatus(_notificationId: number, _status: "read" | "unread"): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>> {
    return success();
  }
}
