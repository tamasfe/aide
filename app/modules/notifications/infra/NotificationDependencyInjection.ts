import type { PublicRuntimeConfig } from "nuxt/schema";
import type { NotificationBannerRepositoryI } from "../domain/NotificationBannerRepository";
import type { NotificationBackendRepositoryI } from "../domain/NotificationBackendRepository";
import { NotificationToastBuilder } from "../domain/NotificationToastBuilder";
import { NotificationBannerRepositoryCookie } from "./NotificationBannerRepositoryCookie";
import { SearchNotificationBannersFromPromoBar } from "./ui/SearchNotificationBannersFromPromoBar";
import { MarkNotificationBannerAsReadFromPromoBar } from "./ui/MarkNotificationBannerAsReadFromPromoBar";
import { ShowNotificationToastToStoreFromWebsocketBackendNotification } from "./ui/ShowNotificationToastToStoreFromWebsocketBackendNotification";
import { NotificationBackendRepositoryGirobet } from "./NotificationBackendRepositoryGirobet";
import { NotificationBackendRepositoryDumb } from "./NotificationBackendRepositoryDumb";
import { MarkNotificationToastAsRead } from "./ui/MarkNotificationToastAsRead";
import { SearchLastUnreadNotificationToasts } from "./ui/SearchLastUnreadNotificationToasts";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import type { PiniaStore } from "~/types/utils";

export interface NotificationDependencyInjectionI {
  ui: {
    searchNotificationBannersFromPromoBar: SearchNotificationBannersFromPromoBar;
    markNotificationBannerAsReadFromPromoBar: MarkNotificationBannerAsReadFromPromoBar;
    showNotificationToastToStoreFromWebsocketBackendNotification: ShowNotificationToastToStoreFromWebsocketBackendNotification;
    markNotificationToastAsRead: MarkNotificationToastAsRead;
    searchLastUnreadNotificationToasts: SearchLastUnreadNotificationToasts;
  };
}

export const createNotificationDependencyInjection: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => Promise<NotificationDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const mode = config.apiMode;

  const notificationBannerRepo: NotificationBannerRepositoryI = new NotificationBannerRepositoryCookie(
    commonDependencies.translateFunction,
  );

  const notificationToastRepo: NotificationBackendRepositoryI = (() => {
    if (mode === "dumb") {
      return new NotificationBackendRepositoryDumb();
    }
    return new NotificationBackendRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const notificationToastBuilder = new NotificationToastBuilder(commonDependencies.translateFunction);

  return {
    ui: {
      searchNotificationBannersFromPromoBar: new SearchNotificationBannersFromPromoBar(notificationBannerRepo, commonDependencies.logger),
      markNotificationBannerAsReadFromPromoBar: new MarkNotificationBannerAsReadFromPromoBar(notificationBannerRepo, commonDependencies.logger),
      showNotificationToastToStoreFromWebsocketBackendNotification: new ShowNotificationToastToStoreFromWebsocketBackendNotification(notificationsStore, notificationToastBuilder),
      markNotificationToastAsRead: new MarkNotificationToastAsRead(notificationToastRepo, commonDependencies.logger),
      searchLastUnreadNotificationToasts: new SearchLastUnreadNotificationToasts(notificationToastRepo, notificationToastBuilder, commonDependencies.logger),
    },
  };
};
