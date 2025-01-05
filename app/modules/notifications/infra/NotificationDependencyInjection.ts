import type { PublicRuntimeConfig } from "nuxt/schema";
import type { NotificationBannerRepositoryI } from "../domain/NotificationBannerRepository";
import type { NotificationBackendRepositoryI } from "../domain/NotificationBackendRepository";
import { NotificationBannerRepositoryCookie } from "./NotificationBannerRepositoryCookie";
import { SearchNotificationBannersFromPromoBar } from "./ui/SearchNotificationBannersFromPromoBar";
import { MarkNotificationBannerAsReadFromPromoBar } from "./ui/MarkNotificationBannerAsReadFromPromoBar";
import { ShowNotificationToastToStoreFromPaymentUpdated } from "./ui/ShowNotificationToastToStoreFromPaymentUpdated";
import { NotificationBackendRepositoryGirobet } from "./NotificationBackendRepositoryGirobet";
import { NotificationBackendRepositoryDumb } from "./NotificationBackendRepositoryDumb";
import { MarkNotificationToastAsRead } from "./ui/MarkNotificationToastAsRead";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import type { PiniaStore } from "~/types/utils";

export interface NotificationDependencyInjectionI {
  ui: {
    searchNotificationBannersFromPromoBar: SearchNotificationBannersFromPromoBar;
    markNotificationBannerAsReadFromPromoBar: MarkNotificationBannerAsReadFromPromoBar;
    passNotificationToastToStoreFromPaymentUpdated: ShowNotificationToastToStoreFromPaymentUpdated;
    markNotificationToastAsRead: MarkNotificationToastAsRead;
  };
}

export const createNotificationDependencyInjection: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => Promise<NotificationDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => {
  const apiBaseUrl = config.apiBaseUrlClient;

  const notificationBannerRepo: NotificationBannerRepositoryI = new NotificationBannerRepositoryCookie(
    commonDependencies.translateFunction,
  );

  const notificationToastRepo: NotificationBackendRepositoryI = (() => {
    if (!apiBaseUrl) {
      return new NotificationBackendRepositoryDumb();
    }
    return new NotificationBackendRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      searchNotificationBannersFromPromoBar: new SearchNotificationBannersFromPromoBar(notificationBannerRepo, commonDependencies.logger),
      markNotificationBannerAsReadFromPromoBar: new MarkNotificationBannerAsReadFromPromoBar(notificationBannerRepo, commonDependencies.logger),
      passNotificationToastToStoreFromPaymentUpdated: new ShowNotificationToastToStoreFromPaymentUpdated(notificationsStore, commonDependencies.translateFunction),
      markNotificationToastAsRead: new MarkNotificationToastAsRead(notificationToastRepo, commonDependencies.logger),
    },
  };
};
