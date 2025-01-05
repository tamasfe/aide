import type { PublicRuntimeConfig } from "nuxt/schema";
import type { NotificationBannerRepositoryI } from "../domain/NotificationBannerRepository";
import { NotificationBannerRepositoryCookie } from "./NotificationBannerRepositoryCookie";
import { SearchNotificationBannersFromPromoBar } from "./ui/SearchNotificationBannersFromPromoBar";
import { MarkNotificationBannerAsReadFromPromoBar } from "./ui/MarkNotificationBannerAsReadFromPromoBar";
import { ShowNotificationToastToStoreFromPaymentUpdated } from "./ui/ShowNotificationToastToStoreFromPaymentUpdated";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import type { PiniaStore } from "~/types/utils";

export interface NotificationDependencyInjectionI {
  ui: {
    searchNotificationBannersFromPromoBar: SearchNotificationBannersFromPromoBar;
    markNotificationBannerAsReadFromPromoBar: MarkNotificationBannerAsReadFromPromoBar;
    passNotificationToastToStoreFromPaymentUpdated: ShowNotificationToastToStoreFromPaymentUpdated;
  };
}

export const createNotificationDependencyInjection: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => Promise<NotificationDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, notificationsStore: PiniaStore<typeof useNotificationsStore>) => {
  const notificationRepo: NotificationBannerRepositoryI = new NotificationBannerRepositoryCookie(
    commonDependencies.translateFunction,
  );

  return {
    ui: {
      searchNotificationBannersFromPromoBar: new SearchNotificationBannersFromPromoBar(notificationRepo, commonDependencies.logger),
      markNotificationBannerAsReadFromPromoBar: new MarkNotificationBannerAsReadFromPromoBar(notificationRepo, commonDependencies.logger),
      passNotificationToastToStoreFromPaymentUpdated: new ShowNotificationToastToStoreFromPaymentUpdated(notificationsStore, commonDependencies.translateFunction),
    },
  };
};
