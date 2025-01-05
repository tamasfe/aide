import type { NotificationBannerI } from "./NotificationBanner";
import type { ErrorRetrievingNotifications } from "./ErrorRetrievingNotifications";
import type { ErrorSavingNotification } from "./ErrorSavingNotification";
import type { ErrorNotificationNotFound } from "./ErrorNotificationNotFound";
import type { EmptyResult, Result } from "~/packages/result";

export interface NotificationBannerRepositoryI {
  search(
    searchParams: {
      readStatus: "read" | "unread" | null;
    }
  ): Promise<
    Result<
      { notifications: NotificationBannerI[] },
      ErrorRetrievingNotifications
    >
  >;

  updateReadStatus(notificationId: number, status: "read" | "unread"): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>>;
}
