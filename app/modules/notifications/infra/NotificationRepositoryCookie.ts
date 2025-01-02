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
import type { CookieRef } from "#app";

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

type NotificationsRecordCookie = {
  savedAt: string;
  notifications: NotificationPropsI[];
};

export class NotificationRepositoryCookie implements NotificationRepositoryI {
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

  public constructor(private t: TranslateFunctionType) {}

  private retrieveNotifications(): NotificationI[] {
    const notificationsRecord = this.useCookie().value;

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
    const newNotificationRecord: NotificationsRecordCookie = {
      savedAt: new Date().toISOString(),
      notifications: notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
        readAt: notification.readAt ? notification.readAt.toISOString() : null,
      })),
    };

    const cookie = this.useCookie();
    cookie.value = newNotificationRecord;
  }

  private useCookie(): CookieRef<NotificationsRecordCookie | null> {
    const inOneYear = new Date(Date.now() + 365 * 24 * 3600 * 1000);
    return useCookie<NotificationsRecordCookie | null>(this.COOKIE_NAME, {
      default: () => null,
      expires: inOneYear,
      httpOnly: false,
    });
  }

  private COOKIE_NAME = "girobet_notifications" as const;
}
