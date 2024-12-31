import type {
  NotificationType,
  NotificationI,
  NotificationPropsI,
} from "../domain/Notification";
import type { NotificationRepositoryI } from "../domain/NotificationRepository";
import { ErrorRetrievingNotifications } from "../domain/ErrorRetrievingNotifications";
import { ErrorSavingNotification } from "../domain/ErrorSavingNotification";
import { ErrorNotificationNotFound } from "../domain/ErrorNotificationNotFound";
import type { TranslateFunctionType } from "~/packages/translation";
import {
  fail,
  success,
  type EmptyResult,
  type Result,
} from "~/packages/result";

const DISGREGARD_SAVED_BEFORE = new Date("2024-12-31T13:35:23.690Z");
const generateBanners = (t: TranslateFunctionType): NotificationI[] => {
  return [
    {
      id: 1111, // Make sure to not repeat the same id on different notifications or they may not be marked as read correctly.
      createdAt: new Date(),
      readAt: null,
      type: "banner",
      data: {
        link: null,
        message: t("promo_bar.refer.message"),
        title: t("promo_bar.refer.title"),
      },
    },
  ];
};

type NotificationsRecordLocalStorage = {
  savedAt: string;
  notifications: NotificationPropsI[];
};

export class NotificationRepositoryLocalStorage
implements NotificationRepositoryI {
  public async searchPaginating(
    searchParams: {
      readStatus: "read" | "unread" | null;
      types: NotificationType[] | null;
    },
    _limit: number,
    _offset: number,
  ): Promise<
      Result<
        {
          notifications: NotificationI[];
          pagination: { limit: number; offset: number; totalItems: number };
        },
        ErrorRetrievingNotifications
      >
    > {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        ErrorRetrievingNotifications.newFromError(
          {},
          new Error(
            "This repo should only be run in the client side. LocalStorage is not available on server side rendering",
          ),
        ),
      );
    }

    try {
      const notifications = this.retrieveNotifications();

      const filteredNotifications = notifications.filter((notification) => {
        if (searchParams.readStatus) {
          if (
            searchParams.readStatus === "read"
            && notification.readAt === null
          )
            return false;
          if (
            searchParams.readStatus === "unread"
            && notification.readAt !== null
          )
            return false;
        }

        if (
          searchParams.types
          && !searchParams.types.includes(notification.type)
        ) {
          return false;
        }

        return true;
      });

      return success({
        notifications: filteredNotifications,
        pagination: {
          limit: 500,
          offset: 0,
          totalItems: filteredNotifications.length,
        },
      });
    }
    catch (error) {
      return fail(ErrorRetrievingNotifications.newFromUnknownError({}, error));
    }
  }

  public async updateReadStatus(
    notificationId: number,
    status: "read" | "unread",
  ): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>> {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        ErrorSavingNotification.newFromError(
          {},
          new Error(
            "This repo should only be run in the client side. LocalStorage is not available on server side rendering",
          ),
        ),
      );
    }

    try {
      const notifications = this.retrieveNotifications();

      const notification = notifications.find(
        notification => notification.id === notificationId,
      );
      if (!notification) {
        return fail(ErrorNotificationNotFound.new({ notificationId }));
      }

      const updatedNotification: NotificationI = {
        ...notification,
        readAt: status === "read" ? new Date() : null,
      };

      this.saveNotifications(
        notifications.map(notification =>
          notification.id === notificationId
            ? updatedNotification
            : notification,
        ),
      );

      return success();
    }
    catch (error) {
      return fail(ErrorSavingNotification.newFromUnknownError({}, error));
    }
  }

  constructor(private t: TranslateFunctionType) {}

  private retrieveNotifications(): NotificationI[] {
    const notificationsRecordStringified = window.localStorage.getItem(
      this.STORAGE_ID_KEY,
    );
    const notificationsRecord: NotificationsRecordLocalStorage | null
      = notificationsRecordStringified
        ? (JSON.parse(
            notificationsRecordStringified,
          ) as NotificationsRecordLocalStorage)
        : null;

    return (() => {
      if (
        notificationsRecord
        && new Date(notificationsRecord.savedAt) > DISGREGARD_SAVED_BEFORE
      ) {
        return notificationsRecord.notifications.map(notification => ({
          ...notification,
          createdAt: new Date(notification.createdAt),
          readAt: notification.readAt ? new Date(notification.readAt) : null,
        }));
      }

      return generateBanners(this.t);
    })();
  }

  private saveNotifications(notifications: NotificationI[]) {
    const newNotificationRecord: NotificationsRecordLocalStorage = {
      savedAt: new Date().toISOString(),
      notifications: notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
        readAt: notification.readAt ? notification.readAt.toISOString() : null,
      })),
    };

    window.localStorage.setItem(
      this.STORAGE_ID_KEY,
      JSON.stringify(newNotificationRecord),
    );
  }

  private isLocalStorageAvailable() {
    return typeof window !== "undefined" && window.localStorage;
  }

  private STORAGE_ID_KEY = "girobet-notifications" as const;
}
