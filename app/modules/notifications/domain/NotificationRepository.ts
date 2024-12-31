import type { NotificationI, NotificationType } from "./Notification";
import type { EmptyResult, Result } from "~/packages/result";
import type { ErrorRetrievingNotifications } from "./ErrorRetrievingNotifications";
import type { ErrorSavingNotification } from "./ErrorSavingNotification";
import type { ErrorNotificationNotFound } from "./ErrorNotificationNotFound";

export interface NotificationRepositoryI {
  searchPaginating(
    searchParams: {
      readStatus: "read" | "unread" | null;
      types: NotificationType[] | null;
    },
    limit: number,
    offset: number,
  ): Promise<
    Result<
      {
        notifications: NotificationI[];
        pagination: {
          limit: number;
          offset: number;
          totalItems: number;
        };
      },
      ErrorRetrievingNotifications
    >
  >;

  updateReadStatus(notificationId: number, status: 'read' | 'unread'): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>>;
}
