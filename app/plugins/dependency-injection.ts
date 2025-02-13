import { loadDependencies } from "~/dependency-injection/load-di";
import { createGamesDependencyInjection } from "~/modules/games/infra/GamesDependencyInjection";
import { createKycDependencyInjection } from "~/modules/kyc/infra/KycDependencyInjection";
import { createNotificationDependencyInjection } from "~/modules/notifications/infra/NotificationDependencyInjection";
import { createProvidersDependencyInjection } from "~/modules/providers/infra/ProvidersDependencyInjection";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";
import { createSitesDependencyInjection } from "~/modules/sites/infra/SitesDependencyInjection";
import { createUsersDependencyInjection } from "~/modules/users/infra/UsersDependencyInjection";
import { createWalletsDependencyInjection } from "~/modules/wallet/infra/WalletsDependencyInjection";
import { createWebsocketDependencyInjectionI } from "~/packages/websocket/infra/websocket-dependency-injection";

export default defineNuxtPlugin({
  name: "dependency-injection",
  dependsOn: ["i18n:plugin", "i18n:plugin:switch-locale-path-ssr"],
  async setup(_nuxtApp) {
    const { $i18n } = useNuxtApp();
    const config = useRuntimeConfig();
    const { hostname } = useRequestURL();
    const requestHeaders = useRequestHeaders();
    const notificationsStore = useNotificationsStore();

    const commonDependencies = await loadDependencies(config.public, $i18n, {
      currentHost: hostname,
      headers: requestHeaders,
      locale: $i18n.locale.value,
      userJurisdiction: config.public.genericFixedUserJurisdiction,
    });

    return {
      provide: {
        dependencies: {
          common: commonDependencies,
          signupFlows: createSignupFlowsDependencyInjection(config.public, commonDependencies),
          games: await createGamesDependencyInjection(config.public, commonDependencies),
          users: await createUsersDependencyInjection(config.public, commonDependencies),
          wallets: createWalletsDependencyInjection(config.public, commonDependencies),
          providers: await createProvidersDependencyInjection(config.public, commonDependencies),
          kyc: await createKycDependencyInjection(config.public, commonDependencies),
          websockets: await createWebsocketDependencyInjectionI(config.public, commonDependencies),
          notifications: await createNotificationDependencyInjection(config.public, commonDependencies, notificationsStore),
          sites: await createSitesDependencyInjection(config.public, commonDependencies),
        },
      },
    };
  },
});
