import { loadDependencies } from "~/dependency-injection/load-di";
import { createGamesDependencyInjection } from "~/modules/games/infra/GamesDependencyInjection";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";
import { createUsersDependencyInjection } from "~/modules/users/infra/UsersDependencyInjection";

export default defineNuxtPlugin({
  name: "dependency-injection",
  async setup(_nuxtApp) {
    const config = useRuntimeConfig();
    const commonDependencies = await loadDependencies();
    const requestHeaders = useRequestHeaders();

    return {
      provide: {
        dependencies: {
          common: commonDependencies,
          signupFlows: createSignupFlowsDependencyInjection(config.public, commonDependencies, requestHeaders),
          games: await createGamesDependencyInjection(config.public, commonDependencies, requestHeaders),
          users: await createUsersDependencyInjection(config.public, commonDependencies, requestHeaders),
        },
      },
    };
  },
});
