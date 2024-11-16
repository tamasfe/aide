import { loadDependencies } from "~/dependency-injection/load-di";
import { createGamesDependencyInjection } from "~/modules/games/infra/GamesDependencyInjection";
import { createProvidersDependencyInjection } from "~/modules/providers/infra/ProvidersDependencyInjection";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";
import { createUsersDependencyInjection } from "~/modules/users/infra/UsersDependencyInjection";
import { createWalletsDependencyInjection } from "~/modules/wallet/infra/WalletsDependencyInjection";

export default defineNuxtPlugin({
  name: "dependency-injection",
  dependsOn: ["i18n:plugin", "i18n:plugin:switch-locale-path-ssr"],
  async setup(_nuxtApp) {
    const { $i18n } = useNuxtApp();
    const config = useRuntimeConfig();
    const commonDependencies = await loadDependencies(config.public, $i18n.t, $i18n.d, $i18n.n);
    const requestHeaders = useRequestHeaders();

    return {
      provide: {
        dependencies: {
          common: commonDependencies,
          signupFlows: createSignupFlowsDependencyInjection(config.public, commonDependencies, requestHeaders),
          games: await createGamesDependencyInjection(config.public, commonDependencies, requestHeaders),
          users: await createUsersDependencyInjection(config.public, commonDependencies, requestHeaders),
          wallets: createWalletsDependencyInjection(config.public, commonDependencies, requestHeaders),
          providers: await createProvidersDependencyInjection(config.public, commonDependencies, requestHeaders),
        },
      },
    };
  },
});
