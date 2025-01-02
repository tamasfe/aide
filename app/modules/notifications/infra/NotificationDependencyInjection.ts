import type { PublicRuntimeConfig } from "nuxt/schema";
import type { NotificationRepositoryI } from "../domain/NotificationRepository";
import { NotificationRepositoryCookie } from "./NotificationRepositoryCookie";
import { SearchNotificationBannersFromPromoBar } from "./ui/SearchNotificationBannersFromPromoBar";
import { MarkNotificationBannerAsReadFromPromoBar } from "./ui/MarkNotificationBannerAsReadFromPromoBar";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface NotificationDependencyInjectionI {
  ui: {
    searchNotificationBannersFromPromoBar: SearchNotificationBannersFromPromoBar;
    markNotificationBannerAsReadFromPromoBar: MarkNotificationBannerAsReadFromPromoBar;
  };
}

export const createNotificationDependencyInjection: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => Promise<NotificationDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const notificationRepo: NotificationRepositoryI = new NotificationRepositoryCookie(
    commonDependencies.translateFunction,
  );

  return {
    ui: {
      searchNotificationBannersFromPromoBar: new SearchNotificationBannersFromPromoBar(notificationRepo, commonDependencies.logger),
      markNotificationBannerAsReadFromPromoBar: new MarkNotificationBannerAsReadFromPromoBar(notificationRepo, commonDependencies.logger),
    },
  };
};
