import type { NotificationBackend } from "./NotificationBackend";
import type { ErrorRetrievingNotifications } from "./ErrorRetrievingNotifications";
import type { ErrorSavingNotification } from "./ErrorSavingNotification";
import type { ErrorNotificationNotFound } from "./ErrorNotificationNotFound";
import type { EmptyResult, Result } from "~/packages/result";

export interface NotificationBackendRepositoryI {
  searchPaginating(
    searchParams: {
      readStatus?: "read" | "unread" | null;
      types?: NotificationBackend["type"][] | null;
    },
    limit: number,
    offset: number,
  ): Promise<
    Result<
      {
        notifications: NotificationBackend[];
        pagination: {
          limit: number;
          offset: number;
          totalItems: number;
        };
      },
      ErrorRetrievingNotifications
    >
  >;

  updateReadStatus(notificationId: number, status: "read" | "unread"): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>>;
}
