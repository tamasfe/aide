import type { NotificationBannerRepositoryI } from "~/modules/notifications/domain/NotificationBannerRepository";
import type { NotificationBackendRepositoryI } from "~/modules/notifications/domain/NotificationBackendRepository";
import { NotificationToastBuilder } from "~/modules/notifications/domain/NotificationToastBuilder";
import { NotificationBannerRepositoryCookie } from "~/modules/notifications/infra/NotificationBannerRepositoryCookie";
import { SearchNotificationBannersFromPromoBar } from "~/modules/notifications/infra/ui/SearchNotificationBannersFromPromoBar";
import { MarkNotificationBannerAsReadFromPromoBar } from "~/modules/notifications/infra/ui/MarkNotificationBannerAsReadFromPromoBar";
import { ShowNotificationToastToStoreFromWebsocketBackendNotification } from "~/modules/notifications/infra/ui/ShowNotificationToastToStoreFromWebsocketBackendNotification";
import { NotificationBackendRepositoryGirobet } from "~/modules/notifications/infra/NotificationBackendRepositoryGirobet";
import { MarkNotificationToastAsRead } from "~/modules/notifications/infra/ui/MarkNotificationToastAsRead";
import { SearchLastUnreadNotificationToasts } from "~/modules/notifications/infra/ui/SearchLastUnreadNotificationToasts";

export default function () {
  const { $apiClient, $i18n } = useNuxtApp();
  const logger = useLogger();
  const notificationsStore = useNotificationsStore();

  const notificationBannerRepo: NotificationBannerRepositoryI
    = new NotificationBannerRepositoryCookie($i18n.t);

  const notificationToastRepo: NotificationBackendRepositoryI = (() => {
    return new NotificationBackendRepositoryGirobet($apiClient);
  })();

  const notificationToastBuilder = new NotificationToastBuilder($i18n.t);

  return {
    ui: {
      searchNotificationBannersFromPromoBar:
        new SearchNotificationBannersFromPromoBar(
          notificationBannerRepo,
          logger,
        ),
      markNotificationBannerAsReadFromPromoBar:
        new MarkNotificationBannerAsReadFromPromoBar(
          notificationBannerRepo,
          logger,
        ),
      showNotificationToastToStoreFromWebsocketBackendNotification:
        new ShowNotificationToastToStoreFromWebsocketBackendNotification(
          notificationsStore,
          notificationToastBuilder,
        ),
      markNotificationToastAsRead: new MarkNotificationToastAsRead(
        notificationToastRepo,
        logger,
      ),
      searchLastUnreadNotificationToasts:
        new SearchLastUnreadNotificationToasts(
          notificationToastRepo,
          notificationToastBuilder,
          logger,
        ),
    },
  };
}
